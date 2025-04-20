"use client";

import Link from "next/link";
import styled from "styled-components";

const StyledHeader = styled.header`
    padding: 1rem 2rem;
    background-color:rgb(7, 95, 117);
    border-bottom: 1px solid #ddd;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: bold;
    font-size: 1.5rem;
    color: #fff;
`;

export default function Header() {
    return (
        <>
            <StyledHeader>
                <nav>
                    <StyledLink href="/">🏠Home</StyledLink> | <StyledLink href="/blog/list">💬Blog</StyledLink>
                </nav>
            </StyledHeader>       
        </>
    );
}

 