'use client'

import React from 'react';
import styled from 'styled-components';

type Props = {
    label: string;
};

const TagWrapper = styled.span`
    background-color: #C7605E;
    padding: 0.2rem 0.6rem;
    border-radius: 0.8rem;
    margin-right: 0.5rem;
    font-size: 0.8rem;
    display: inline-block;
    color: #4A4A4A;
    font-weight: bold;
`;

export default function Tag({ label }: Props) {
    return <TagWrapper>#{label}</TagWrapper>;
};


