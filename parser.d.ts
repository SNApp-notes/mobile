
declare class SyntaxError extends Error {
    constructor(message: string, expected: string, found: string, location: { start: { offset: number } });
}


interface TextNode {
    type: 'text' | 'bold' | 'italic' | 'list';
    content: string;
}

interface CodeNode {
    type: 'code';
    content: string;
    language?: string;
}

interface HeaderNode {
    type: 'header';
    content: string;
    level: number;
}

interface LinkNode {
    type: 'link';
    text: string;
    link: string;
}

type MarkdownNode = TextNode | LinkNode | HeaderNode | CodeNode;

declare function parse(input: string, options?: { startRule?: string }): MarkdownNode[];

export {
    SyntaxError,
    parse,
    MarkdownNode,
    TextNode,
    HeaderNode,
    LinkNode
};
