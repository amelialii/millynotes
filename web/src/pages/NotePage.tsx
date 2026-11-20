import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import rehypePrism from 'rehype-prism-plus'
import rehypeRaw from 'rehype-raw'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { Children, isValidElement, useEffect, type ComponentProps, type ReactNode } from 'react'
import type { Components, ExtraProps } from 'react-markdown'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { getCategoryById } from '../categories'
import { getNoteRaw } from '../lib/notesIndex'
import { preserveLeadingTabsOutsideCode } from '../lib/preserveLineLeadingIndent'
import { preprocessVaultMarkdown } from '../lib/vaultImages'
import remarkBlankLineGaps from '../lib/blankLineGaps'
import { stripFrontmatter, titleFromPathKey } from '../lib/parseNoteFile'
import { convertWikiLinks, slugifyHeading } from '../lib/wikiLinks'

function nodeText(node: ReactNode): string {
  return Children.toArray(node)
    .map((c) => {
      if (typeof c === 'string' || typeof c === 'number') return String(c)
      if (isValidElement<{ children?: ReactNode }>(c)) return nodeText(c.props.children)
      return ''
    })
    .join('')
}

function heading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({ children, ...props }: ComponentProps<typeof Tag> & ExtraProps) {
    delete props.node
    return (
      <Tag {...props} id={slugifyHeading(nodeText(children))}>
        {children}
      </Tag>
    )
  }
}

const markdownComponents: Components = {
  a({ href, children }) {
    if (href?.startsWith('/')) {
      return (
        <Link to={href} className="wikilink">
          {children}
        </Link>
      )
    }
    return <a href={href}>{children}</a>
  },
  h1: heading('h1'),
  h2: heading('h2'),
  h3: heading('h3'),
  h4: heading('h4'),
  h5: heading('h5'),
  h6: heading('h6'),
}

function decodePathParam(param: string | undefined): string {
  if (!param) return ''
  try {
    return decodeURIComponent(param)
  } catch {
    return param
  }
}

export default function NotePage() {
  const { categoryId, notePath } = useParams<{
    categoryId: string
    notePath: string
  }>()
  const category = categoryId ? getCategoryById(categoryId) : undefined
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    el?.scrollIntoView()
  }, [hash, notePath])

  if (!categoryId) {
    return <Navigate to="/" replace />
  }

  if (!category) {
    return <Navigate to="/" replace />
  }

  const decodedPath = decodePathParam(notePath)
  const raw =
    decodedPath.length > 0 ? getNoteRaw(category.vaultFolder, decodedPath) : null

  if (!raw) {
    return <Navigate to={`/category/${encodeURIComponent(categoryId)}`} replace />
  }

  const title = titleFromPathKey(decodedPath)
  const body = preserveLeadingTabsOutsideCode(
    convertWikiLinks(
      preprocessVaultMarkdown(
        stripFrontmatter(raw),
        category.vaultFolder,
        decodedPath,
      ),
      category.vaultFolder,
    ),
  )

  return (
    <article className="note-view">
      <Link
        to={`/category/${encodeURIComponent(categoryId)}`}
        className="note-view__back"
      >
        ← {category.name}
      </Link>
      <h1 className="note-view__title">{title}</h1>
      <div className="note-view__body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkBlankLineGaps]}
          rehypePlugins={[
            [rehypeKatex, { strict: false }],
            rehypeRaw,
            [rehypePrism, { ignoreMissing: true }],
          ]}
          components={markdownComponents}
        >
          {body}
        </ReactMarkdown>
      </div>
    </article>
  )
}
