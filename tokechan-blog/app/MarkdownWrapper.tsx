"use client"

import styled from "styled-components";

const StyledMarkdown = styled.div`
    line-height: 1.8;
    font-size: 1.1rem;

    h1, h2, h3, h4, h5, h6 {
        margin: 2rem 0 1rem 0;
        font-weight: 600;
        line-height: 1.6;
    }

    h1 {
        font-size: 2.5rem;
    }

    h2 {
        font-size: 2rem;
    }
    
    h3 {
        font-size: 1.8rem;
    }

    h4 {
        font-size: 1.5rem;
    }

    h5 {
        font-size: 1.2rem;
    }

    h6 {
        font-size: 1rem;
    }

    p {
        margin-bottom: 1rem;
    }

    ul, ol {
        padding-left: 1.5rem;
        margin-bottom: 1rem;
    }

    ul {
        list-style-type: disc;
    }

    ol {
        list-style-type: decimal;
    }

    blockquote {
        margin: 1rem 0;
        padding-left: 1.5rem;
        border-left: 4px solid #000;
    }   

    code {
        background-color:#EDE8E2;
        padding: 0.2rem 0.4rem;
        border-radius: 6px;
        font-size: 0.9rem;
        font-family: monospace;
    }

    pre {
        background:#EDE8E2;
        color:#4A4A4A;
        padding: 1rem;
        border-radius: 6px;
        overflow-x: auto;
        margin: 2rem 0;
    }

    a {
        color: #BF8B67;
        text-decoration: none;
    }
` 
;

type Props = {
    html: string;
    className?: string;
};

const MarkdownWrapper = ({ html, className }: Props) => {
    return (
        <StyledMarkdown 
            className={className}   
            dangerouslySetInnerHTML={{ __html: html }} 
        />
    );
}

export default MarkdownWrapper;
    
    
