import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import toc from "remark-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 as style } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ModalImage from "react-modal-image";
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
        img: image => <ModalImage 
          small={image.src}
          large={image.src}
          alt={image.alt}
          hideZoom={false}
        />
      }}
    />
  );
};

export default PostBody;
