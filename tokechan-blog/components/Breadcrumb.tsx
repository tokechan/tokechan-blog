'use client'

import Link from "next/link";
import styled from "styled-components";


type Props = {
    items: {
        label: string;
        href: string;
    }[];
};

const Nav = styled.nav`
    margin-bottom: 1rem;
`;


const List = styled.ol`
    display: flex;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
`;

const LiItem = styled.li`
    a {
    text-decoration: none;
    color:#C7605E;
    }

    &:hover {
        cursor: pointer;
        color:#C7605E;
        text-decoration: underline;
    }


  }
`;

const Separator = styled.span`
    color:#C7605E;
    margin-left: 0.2rem;
    margin-right: 0.2rem;

    &:hover {

        color:#C7605E;
    }
`;

export const Breadcrumb = ({ items }: Props) => {
    return (
        <Nav aria-label="breadcrumb">
              <List>
                {items.map((item, index) => (
                    <LiItem key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                        {index < items.length - 1 && <Separator> / </Separator>}
                    </LiItem>
                ))}
            </List>
        </Nav>
    );    
}