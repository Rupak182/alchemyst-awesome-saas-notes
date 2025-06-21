import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { QASSchema, QASchema,questionSchema } from "./types.js";
import { Annotation, StateGraph, Send } from "@langchain/langgraph";
import { z } from "zod";
import { mdToPdf } from "md-to-pdf";

import * as dotenv from 'dotenv';
import fs from 'fs';
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const llm = new ChatOpenAI({
    model: process.env.MODEL,
    apiKey: process.env.API_KEY ,
    configuration: {
      baseURL: process.env.BASE_URL,
    },
  });



// Needed when running it seperately from the server
function imageToBase64(imagePath: string) {
    return fs.readFileSync(imagePath, { encoding: "base64" });
}


// const llm = new ChatGoogleGenerativeAI({
//     model: "gemini-2.5-flash",
// });


const questionExtractLLM = llm.withStructuredOutput(z.array(questionSchema))
const qaGeneratorLLM = llm.withStructuredOutput(QASchema)


const stateAnnotation = Annotation.Root({
    base64Image: Annotation<string>,
    questionPaper: Annotation<string>,
    questions: Annotation<z.infer<typeof questionSchema>[]>,
    question: Annotation<z.infer<typeof questionSchema>>,
    CompletedQAPairs: Annotation<z.infer<typeof QASSchema>>({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    FinalNotes: Annotation<string>
})

async function qpToMarkdown(state: typeof stateAnnotation.State) {
    const result = await llm.invoke([
        {
            role: "system",
            content: `You are an expert in converting question papers to markdown format.`
        },
        {
            role: "user",
            content: [
                {
                    type: "text",
                    text: "Convert the following question paper to markdown format. Focus more on extracting questions and answers not irrelevant text."
                },
                {
                    type: "image",
                    source_type: "base64",
                    mime_type: "image/png",
                    data: state.base64Image

                    //  type: "image_url", 
                    // image_url: { 
                    //     url: `data:image/png;base64,${state.base64Image}`,
                    //     detail: "high"
                    // } 
                }
            ]
        }
    ]);
    return { questionPaper: result.content };
}

async function QuestionsExtracter(state: typeof stateAnnotation.State) {
    const result = await questionExtractLLM.invoke([
        {
            role: "system",
            content: `You are an expert in extracting question based on a given question paper.`
        },
        {
            role: "user",
            content: `Extract questions based on the following question paper: ${state.questionPaper}`
        }
    ])
    return { questions: result };
}

async function QAPairGenerator(state: typeof stateAnnotation.State) {
    const result = await qaGeneratorLLM.invoke([
        {
            role: "system",
            content: `You are an expert in generating question-answer pairs based on the given question.`
        },
        {
            role: "user",
            content: `Generate question-answer pairs for the given question: ${state.question.question}.
            Also consider the marks for judging the length of the answer. ${state.question.marks} marks.
            If the question is of higher marks, provide a more detailed answer.
            If the question is of lower marks, provide an answer in around 100 words.
            `
        }
    ]);
    return { CompletedQAPairs: [result] };
}

function assignWorkers(state: typeof stateAnnotation.State) {
    return state.questions.map((question) =>
        new Send("QAPairGenerator", { question })
    )
}

function combineResults(state: typeof stateAnnotation.State) {
    let finalResult = "";
    let index = 0;    for (const qa in state.CompletedQAPairs) {
        finalResult += "**Question " + (index + 1) + ":** " + state.CompletedQAPairs[qa].question + "\n\n";
        finalResult += "**Answer:** " + state.CompletedQAPairs[qa].answer + "\n\n\n";
        index++;
    }
    return { FinalNotes: finalResult }
}



const worker = new StateGraph(stateAnnotation)
    .addNode("qpToMarkdown", qpToMarkdown)
    .addNode("QuestionsExtracter", QuestionsExtracter)
    .addNode("QAPairGenerator", QAPairGenerator)
    .addNode(
        "combineResults",
        combineResults
    )
    .addEdge("__start__", "qpToMarkdown")
    .addEdge("qpToMarkdown", "QuestionsExtracter")
    .addConditionalEdges("QuestionsExtracter", assignWorkers,
        [
            "QAPairGenerator"
        ]
    )
    .addEdge("QAPairGenerator", "combineResults")
    .addEdge("combineResults", "__end__")
    .compile()


export async function generatePdfFromImage(image: string) {
    
 const response = await worker.invoke({
        base64Image: image,
});
  const pdf = await mdToPdf({ content: response.FinalNotes });
  return pdf;
}



// To be use for testing the function separately
async function run() {
    const base64Image = imageToBase64("./image.png");

    //   const response = await llm.invoke("What is the capital of France?");
    const response = await worker.invoke({
        base64Image: base64Image,
    });
    console.log("QP"+response.questionPaper);
    console.log("QUESTIONS:"+response.questions);

    console.log("final:"+response.FinalNotes);
    await mdToPdf({ content: response.FinalNotes }, { dest: './output.pdf' });
    // return response.FinalNotes;
}


// Use it for testing the function seperately

// await run().catch((error) => {
//     console.error("Error during model invocation:", error);
//     process.exit(1);
// });