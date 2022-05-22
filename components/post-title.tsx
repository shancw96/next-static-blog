import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

const PostTitle = ({ children }: Props) => {
  return (
    <h1>
      {children}
    </h1>
  )
}

export default PostTitle
