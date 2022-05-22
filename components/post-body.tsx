import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dracula as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { ghcolors as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { materialDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { pojoaque as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { prism as style } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { synthwave84 as style } from 'react-syntax-highlighter/dist/cjs/styles/prism'
type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    <>
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                // @ts-ignore
                style={style}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
      />
    </>
  );
};

export default PostBody;

