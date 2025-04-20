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
    color:rgb(11, 205, 50);
    }

    &:hover {
        cursor: pointer;
        color:rgb(145, 168, 150);
        text-decoration: underline;
    }


  }
`;

const Separator = styled.span`
    color:rgb(11, 205, 50);
    margin-left: 0.2rem;
    margin-right: 0.2rem;

    &:hover {

        color:rgb(145, 168, 150);
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