import {z} from 'zod'

export const QASchema = z.object({
  question: z.string().describe('The question to be answered'),
  answer: z.string().describe('The answer to the question'),
})

// export const qp = "# EP201 Entrepreneurship\n\n**Time:** Three Hours\n**Max. Marks:** 60\n\n**Part A - Answer ALL Questions**\n5 x 2 = 10 Marks\n\n| No. | Question | CO |\n|-----|----------|----|\n| i | What is a \"problem worth solving\" in a business context? | CO1 |\n| ii | List two key risks in developing a new business model. | CO2 |\n| iii | What are listening skills in the context of sales? | CO3 |\n| iv | What is the role of social media in building a digital presence? | CO4 |\n| v | Why is defining roles and responsibilities important in a team? | CO5 |\n\n**Part B - Answer ALL Questions**\n5 x 8 = 40 Marks\n\n| No. | Question | Marks | CO |\n|-----|----------|-------|----|\n| 1 | Explain the principles of effectuation as proposed by Dr. Saras Sarasvathy and discuss how these principles can be applied by entrepreneurs to navigate uncertainty and create new business opportunities. Provide examples to illustrate each principle in practice.<br>**OR** | 8 | CO1 |\n| 2 | Describe the various types of market segmentation and their importance in targeting the right audience. | 8 | CO1 |\n| 3 | Compare and contrast Red Ocean and Blue Ocean strategies, providing examples of companies that have successfully implemented a Blue Ocean Strategy.<br>**OR** | 8 | CO2 |\n| 4 | Explain the Lean Canvas model and its components. How does it differ from the traditional business plan? | 8 | CO2 |\n| 5 | Describe the process of preparing and delivering a pitch to investors. What elements should be included to make it compelling?<br>**OR** | 8 | CO3 |"

export const QASSchema = z.array(QASchema).describe('An array of question-answer pairs')


export const questionSchema = z.object({
    question: z.string().describe('The question based on the question paper'),
    marks: z.number().describe('Marks for the question'),
})