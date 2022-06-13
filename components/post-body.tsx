import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import toc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { ghcolors as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { materialDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { pojoaque as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import { prism as style } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { synthwave84 as style } from "react-syntax-highlighter/dist/cjs/styles/prism";
import markdownStyle from "../lib/markdown-styles.module.scss";
import githubStyle from "../lib/github-styles.module.scss";
type Props = {
  content: string;
};

const PostBody = ({ content }: Props) => {
  return (
    <ReactMarkdown
      className={githubStyle.markdownStyle}
      children={content}
      remarkPlugins={[remarkGfm, toc]}
      rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
      components={{
        code({ node, inline, className, children, ...props }) {
          console.log(node)
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              // @ts-ignore
              style={style}
              language={match ? match[1] : "text"}
              PreTag="div"
              {...props}
            />
          ) : (
            <code {...props}>{children}</code>
          );
        },
      }}
    />
  );
};

function headingRender(props) {
  console.log('code in')
  switch (props.level) {
    case 1:
      return (
        <div
          style={{
            backgroundColor: "violet",
            fontSize: "60px",
            display: "table",
          }}
        >
          {props.children}
        </div>
      );
    case 2:
      return (
        <div
          style={{
            backgroundColor: "blue",
            fontSize: "50px",
            display: "table",
          }}
        >
          {props.children}
        </div>
      );
    case 3:
      return (
        <div
          style={{
            backgroundColor: "green",
            fontSize: "40px",
            display: "table",
          }}
        >
          {props.children}
        </div>
      );
    case 4:
      return (
        <div
          style={{
            backgroundColor: "orange",
            fontSize: "30px",
            display: "table",
          }}
        >
          {props.children}
        </div>
      );
    case 5:
      return (
        <div
          style={{
            backgroundColor: "yellow",
            fontSize: "20px",
            display: "table",
          }}
        >
          {props.children}
        </div>
      );
    case 6:
    default:
      return (
        <div
          style={{ backgroundColor: "red", fontSize: "10px", display: "table" }}
        >
          {props.children}
        </div>
      );
  }
}

export default PostBody;
