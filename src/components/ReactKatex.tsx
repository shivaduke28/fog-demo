import katex from 'katex';

type KatexProps = {
    formula: string;
}

export const InlineMath: React.FC<KatexProps> = (props) => {
    const html = katex.renderToString(props.formula, {
        throwOnError: false,
    });

    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const DisplayMath: React.FC<KatexProps> = ({ formula }) => {
    const html = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
    });

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
