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
                {post.publishedDate} | {post.category}
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
    margin-nottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 7px;
    background: #fff;
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    color: inherit;
`;

const Title = styled.h2`
    margin: 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #666;

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
    margin-right: 0.5rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: #f0f0f0;
    color: #333;
    font-size: 0.8rem;
`;
