"use client";
import Link from "next/link";
import styled from "styled-components";



const StyledFooter = styled.footer`
    padding: 1rem 2rem;
    background-color:rgb(7, 95, 117);
    border-bottom: 1px solid #ddd;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: bold;
    font-size: 0.5rem;
    color: #fff;
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