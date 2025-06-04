'use client'

import styled from "styled-components";
import Link from "next/link";

type Post = {
    id: string;
    title: string;
    slug: string;
    category?: string;
    tags: string[];
    publishedDate?: string;
    status: string;
}

export const PostItem =({ post }: { post: Post}) => {
    return (
        <PostItemContainer>
            <StyledLink href={`/blog/${post.slug}`}>
                <Title>{post.title}</Title>
            </StyledLink>
            <Meta>
                {post.publishedDate} | 📁 Category: {post.category}
            </Meta>
            <TagsContainer>
                {post.tags.map((tag) => (
                    <Tag key={tag}>#{tag}</Tag>
                ))}
            </TagsContainer>
        </PostItemContainer>
    )
}

const PostItemContainer = styled.li`
    margin-nottom: 5rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 7px;
    background: #F5F2EC;
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
    cursor: pointer;
`;

const Title = styled.h2`
    margin: 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #rgba(216, 148, 13, 0.1)
    &:hover {
        color: #333;
    }
`;

const Meta = styled.p`
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
`;      

const TagsContainer = styled.div`
    margin-top: 0.5rem;
`;

const Tag = styled.span`
    display: inline-block;
    margin: 0.2rem 0.5rem 0 0;
    padding: 0.3rem 0.6rem;
    border-radius: 9999px;
    background-color:rgb(154, 198, 22);
    color: #005a9c;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: default;
`;
