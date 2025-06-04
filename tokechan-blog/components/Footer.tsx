"use client";
import Link from "next/link";
import styled from "styled-components";


const StyledFooter = styled.footer`
    padding: 1.5rem 2rem;
    background-color:#489599;
    border-bottom: 3px solid #D6E6E7;
    border-radius: 12px;
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: bold;
    font-size: 1rem;
    color: #4A4A4A;
    transition: text-decoration 0.3s;
    &:hover {
        text-decoration: underline;
    }
`;
export default function Footer() {
    return (
        <StyledFooter>
            <p>
                <small>&copy; {new Date().getFullYear()} Tokechan Blog</small>           
            </p>
            <nav>
                <StyledLink href="/">🏠Home</StyledLink> | <StyledLink href="/blog/list">💬Blog</StyledLink>
            </nav>
        </StyledFooter>
    );
}