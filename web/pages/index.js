import { Card, Tabs, Tab, Form, Row, Col, InputGroup, Button } from "react-bootstrap"
import Router from "next/router"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faMagnifyingGlass, faPaperPlane, faComment, faPaperclip, faStar } from '@fortawesome/free-solid-svg-icons'
import Sidebar from "../components/Sidebar"


const HomePage = () => {
    return(
        <div style={{margin: "5%"}}>
            <Sidebar />
            <Row id="welcome_section">
                <h1 style={{font: 'italic 5em Georgia'}}>Analego</h1>
            </Row>
            <Row>
                <h3 style={{font: 'italic 3em Georgia'}}>Let's Build Analogy Together!</h3>
            </Row>
            <br />
            <Row>
                <Col md={4}>
                    <p style={{fontSize: '150%'}}>Analego is a human-AI collaborative system for analogy-based instruction. Are you tired of using the same old analogies in your classroom? Would you like to try a new analogy better suited to your students' interests? Try finding or creating a suitable analogy on Analego! </p>
                </Col>
            </Row>
            <Row>
                <Col md={12} style={{display: 'flex'}}>
                    <Button variant="primary" size="lg" style={{marginRight: '1%'}} onClick={() => Router.push("/search")}>Get Started!</Button>
                    <Button variant="success" size="lg" style={{marginRight: '1%'}}>Download Extension</Button>
                    <Button variant="link" size="lg" style={{marginRight: '1%'}}><FontAwesomeIcon icon={faGithub} style={{marginRight: '1%'}}/>Github</Button>
                </Col>
            </Row>
            <br />
            <br />
            <Row>
                <h3 style={{font: 'italic 250% Georgia'}} id='analogy_section'>- Why Analogy -</h3>
                <p className="index-text">By connecting abstract or unfamiliar concepts (called the target) to more familiar ones (called the source), analogies play a huge role in education as they help with understanding concepts, problem-solving, increasing learners' interest and motivation. </p>
                <hr />
                <p style={{font: 'italic 200% Georgia'}}>Example</p>
                <br />
                <p className="index-example">“To picture an atom, you might compare it to the solar system. The nucleus is the sun and the orbiting planets the electrons and neutrons.”</p>
                <p className="index-example">“The fundamental laws of electricity are mathematically complex. But using water as an analogy offers an easy way to gain a basic understanding. The three most basic components of electricity are voltage, current, and resistance. Voltage is like the pressure that pushes water through the hose. Current is like the diameter of the hose. The wider it is, the more water will flow through. Resistance is like sand in the hose that slows down the water flow.”</p>
                <hr />
                <p className="index-text">However, finding and manually creating useful analogies can be challenging! Thus, we aim to leverage AI to assist with analogy-based instruction.</p>
            </Row>
            <br />
            <br />
            <br />
            <h3 style={{font: 'italic 250% Georgia', marginBottom: '3%'}} id='features_section'>- Features -</h3>
            <Row>
                <Col md={6}>
                    <h3 style={{font: 'italic 200% Georgia'}} id='features_search_section'>-- Search --</h3>
                    <p className="index-text"><FontAwesomeIcon icon={faMagnifyingGlass} /> Search: To find a suitable analogy from our database, enter your search query (e.g., body). Since many of these analogies are generated using AI, you can filter results based on the configuration (e.g., prompt instruction) used to generate the analogy.</p>
                    <p className="index-text"><FontAwesomeIcon icon={faPaperPlane} /> Feedback: Provide feedback on the analogy in the form of likes and dislikes. Additionally, you can report an offensive or inappropriate analogy. The report will be reviewed by our team and the analogy would be removed from our database if needed.</p>
                    <p className="index-text"><FontAwesomeIcon icon={faComment} /> Discuss: Start a conversation around the analogy with the broader community (e.g., analyze its limitations, ask for further clarification, share your experience with using it in your teaching).</p>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <div id='box'>
                        <img src="/images/index_search.png" style={{width: '100%'}}/>
                    </div>
                </Col>
            </Row>
            <hr />
            <br />
            <Row>
                <Col md={6} className="d-flex align-items-center">
                    <div id='box'>
                        <img src="/images/index_generate.png" style={{width: '100%'}}/>
                    </div>
                </Col>
                <Col md={6}>
                    <h3 style={{font: 'italic 200% Georgia'}} id='features_generate_section'>-- Generate --</h3>
                    <p className="index-text">If you're unable to find a suitable existing analogy, you can generate a new one. We leverage ChatGPT for this.You first need to sign up and log into the website. Then,</p>
                    <br />
                    <p className="index-text"><FontAwesomeIcon icon={faPaperclip} /> We provide you with 50 free usages per month, meaning that you can generate up to 50 analogies per month for free. You could also optionally provide your own <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key">OpenAI API key</a> in case you need to generate more analogies.</p>
                    <p className="index-text"><FontAwesomeIcon icon={faPaperclip} /> Enter the target concept that you'd like to generate the analogy for (e.g., cell). Optionally, you can also enter the source concept (i.e., any topic that you would like the analogy to be about such as sports).</p>
                    <p className="index-text"><FontAwesomeIcon icon={faPaperclip} /> You can also choose  the prompt instruction used to generate the analogy and other configuration parameters. </p>
                    <br />
                    <p className="index-text">After generating the analogy you could save it to add it to our database, which would allow other users to view it as well! </p>
                </Col>
            </Row>
            <hr />
            <br />
            <Row>
                <Col md={6}>
                    <h3 style={{font: 'italic 200% Georgia'}} id='features_profile_section'>-- Profile --</h3>
                    <p className="index-text">Once you've signed up, you can view details about your user profile and usage history including  issues reported about offensive analogies, your comments and replies received on them, and your past searches and generation log. </p>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <div id='box'>
                        <img src="/images/index_profile.png" style={{width: '100%'}}/>
                    </div>
                </Col>
            </Row>
            <br />
            <br />
            <br />
            <h3 style={{font: 'italic 250% Georgia', marginBottom: '3%'}} id='research_section'>- Ongoing Research & Overall Version  -</h3>
            <Row>
                <Col md={6}>
                    <p className="index-text">Our vision is to create Analego as a human-AI collaborative system where students and teachers leverage AI, specifically large language models (LLMs), for analogy-based instruction. Specifically, it consists of a self-sustained analogy repository built in two main ways: (i) analogy detection and extraction from the Web; (ii) analogy co-generation by LLMs, teachers and students.</p>
                </Col>
                <Col md={6} className="d-flex align-items-center">
                    <div id='box'>
                        <img src="/images/index_research.png" style={{width: '100%'}}/>
                    </div>
                </Col>
            </Row>
            <Row>
                <p className="index-text">Based on this analogy repository and our trained LLMs, the system will provide several features including: (i) analogy retrieval that will show a ranked list of analogies based on appropriate criteria (e.g., accuracy, mapping consistency, grade appropriateness, etc.); (ii) scaffolding analogy-making in students (e.g., guiding them in connecting course concepts to suitable familiar objects); (iii) analogy assessments to critique and analyze the analogies (e.g., identifying where the analogy breaks down). Feedback from students and teachers collected on the system will be used to further refine our models.</p>
                <p className="index-text">With these features, our goal is increase student engagement (e.g., by explaining concepts via suitable analogies familiar to students), increase collaboration (e.g., via collaborative analogy-making), assess comprehension (e.g., via analogy-based assessments), and help generate educational content based on pedagogical preferences of students and teachers.</p>
            </Row>
            <Row>
                <p className="index-example">Analego is based on the following research publications:</p>
                <ul style={{margin: '1%'}}>
                    <li><FontAwesomeIcon icon={faStar} /> Bhavya, Yang Zhou, Shradha Sehgal, Suma Bhat, Chengxiang Zhai. “Analego: Let's build analogies together!” Demo presentation at the AAAI 2024 Workshop on AI for Education (AI4Ed). 2024.</li>
                    <li><FontAwesomeIcon icon={faStar} /> Bhavya, Shradha Sehgal, Jinjun Xiong, Chengxiang Zhai. “AnaDE1.0: A Novel Data Set for Benchmarking Analogy Detection and Extraction” In Proceedings of the 18th Conference of the European Chapter of the Association for Computational Linguistics (EACL). 2024. <a href="https://aclanthology.org/2024.eacl-long.103/ ">Link</a></li>
                    <li><FontAwesomeIcon icon={faStar} /> Bhavya, Jinjun Xiong, Chengxiang Zhai. “CAM: A Large Language Model-based Creative Analogy Mining Framework” In Proceedings of the ACM Web Conference (WWW). 2023.  <a href="https://bhaavya.github.io/files/www23.pdf ">Link</a></li>
                    <li><FontAwesomeIcon icon={faStar} /> Bhavya, Jinjun Xiong, Chengxiang Zhai. “Analogy Generation by Prompting Large Language Models: A Case Study of InstructGPT.” In Proceedings of the 15th International Conference on Natural Language Generation (INLG). 2022.  <a href="https://aclanthology.org/2022.inlg-main.25/">Link</a></li>
                </ul>
            </Row>
            <br />
            <br />
            <br />
            <h3 style={{font: 'italic 250% Georgia', marginBottom: '3%'}} id='disclaimer'>- Disclaimer  -</h3>
            <p className="index-text">This website uses ChatGPT for generation of analogies. Please refer to their <a href="https://openai.com/policies/terms-of-use">Terms of Use</a> before usage.</p>
        </div>
    )
}


export default HomePage;