import React, { useState } from 'react';
import './App.css';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/snippets/html'
import styled from "styled-components";

const HeaderWrapper = styled.div`
    min-height: 6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
`

const Main = styled.main`
    display: flex;
    flex-direction: column;
`

const Content = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    ${'' /* flex-wrap: wrap; */}
`

const Button = styled.button`
    margin: .6rem 0;
    padding: 1rem 3rem;
    background-color: #42f584;
    outline: none;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px 2px rgba(0, 0, 0, .1);
    font-size: 1.3rem;
    cursor: pointer;
    transition: all .3s ease;
    :hover{
        background-color: rgba(0, 0, 0, 0.7);
        color: #fff;
        transition: all .3s ease;
    }
`


const TokenWrapper = styled.div`
    width: 100%;
    min-height: 5rem;
    display: flex;
    flex-direction: row;
    ${'' /* align-items: center; */}
    justify-content: center;
    margin: 5rem 0;
`

const Column = styled.div`
    width: 100%;
    min-width: 20rem;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const TokenSpan = styled.span`
    display: block;
    font-size: rem;
    word-wrap: break-word;
    font-weight: bold;
    width: 34rem;
    padding: .4rem;
    background-color: #fff;
    height: 5rem;
    margin-left: 2rem;
    margin-top: .6rem;
    border-radius: 4px;
`


function App() {
    const [token, setToken] = useState();
    const [response, setResponse] = useState('');
    const [json, setJson] = useState(`{   
    "Target":"Student",
    "Where":{
        "FirstName":"loic"
    },
    "Compound":{
        "School":
        {
            "Name":"outremont"
        }
    }
}`);



    function handleChange(jsonString) {
        setJson(jsonString);
    }

    function validateQuery(jsonString) {
        try {
            console.log(jsonString)
            jsonString = JSON.parse(jsonString);

            console.log(jsonString);

            const validTargets = ["Student", "Teacher", "School", "ReportCard"]
            // validate target
            if (!Reflect.has(jsonString, "Target") || !validTargets.includes(jsonString.Target)) {
                alert("A valid target is required, Student, Teacher, School or ReportCard");
                return false;
            }
            // validate where
            if (Reflect.has(jsonString, "Where")) {

            }

            // validate compound
            if (Reflect.has(jsonString, "Compound")) {

            }
        }
        catch (e) {
            alert("Invalid JSON\n" + e.message)
        }

        return true;
    }

    function handleClick() {
        if (validateQuery(json)) {
            console.log(true)
        }
        postRequest();
    }
    let url = "https://simpleapi20210425111657.azurewebsites.net/"

    async function postRequest() {
        const serverRepsonse = await fetch(url + "api/Queries", {
            method: "POST",
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
            }),
            referrerPolicy: 'origin-when-cross-origin',
            body: json
        })
        let response = await serverRepsonse.json();
        setResponse(JSON.stringify(response, null, '\t'));
    }

    async function getToken() {
        const serverRepsonse = await fetch(url + "/api/authentication", {
            method: "POST",
            headers: new Headers({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Accept-Encoding': 'gzip, deflate, br',
            }),
            referrerPolicy: 'origin-when-cross-origin',
            body: `{"Email":"manager@grics.ca","Password":"password123"}`
        })

        const response = await serverRepsonse.json();

        setToken(response.token);
        setResponse(JSON.stringify(response, null, "\t"));
    }

    return (
        <div className="App">
            <HeaderWrapper>
                ASP.NET MOCK API
            </HeaderWrapper>
            <Main>
                <TokenWrapper>
                    <div>
                        <Button onClick={getToken}>Obtenir token JWT (1h)</Button>
                        <div>Courriel: <b>manager@grics.ca</b></div>
                        <div>Mot de passe: <b>password123</b></div>

                    </div>
                    <TokenSpan>{token}</TokenSpan>
                </TokenWrapper>
                <Content>
                    <Column>
                        <p>route: {url}api/queries/query</p>
                        <AceEditor
                            value={json}
                            mode="json"
                            theme="monokai"
                            onChange={handleChange}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                        />
                        <Button onClick={handleClick}>Envoi requête</Button>
                    </Column>
                    <Column>
                        <p>Réponse serveur :</p>
                        <AceEditor
                            value={response}
                            mode="json"
                            theme="monokai"
                            onChange={handleChange}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                        />
                    </Column>
                </Content>
            </Main>
        </div>
    );
}

export default App;