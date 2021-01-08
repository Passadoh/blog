import React from 'react'
import BlockContent from '@sanity/block-content-to-react'
import {Link} from 'gatsby'
import Figure from './figure'
import {getBlogUrl} from '../lib/helpers'

const BlockRenderer = props => {
  const {style = 'normal'} = props.node

  if (/^h\d/.test(style)) {
    const level = style.replace(/[^\d]/g, '')
    return React.createElement(style, {className: `heading-${level}`}, props.children)
  }

  if (style === 'blockquote') {
    return <blockquote css={{
      paddingLeft: '2rem',
      fontStyle: 'italic',
      fontSize: '2.1rem'
    }}>- {props.children}</blockquote>
  }

  // Fall back to default handling
  return BlockContent.defaultSerializers.types.block(props)
}

const serializers = {
  types: {
    // eslint-disable-next-line react/display-name
    authorReference: ({node}) => <span>{node.author.name}</span>,
    mainImage: Figure,
    // eslint-disable-next-line react/display-name
    codesnippet: props => (
      <div className='code-container'>
        <pre className={`language-${props.node.language}`} data-language={props.node.language}>
          <code className={`language-${props.node.language}`}>{props.node.code}</code>
        </pre>
      </div>
    ),
    block: BlockRenderer
  },
  marks: {
    // eslint-disable-next-line react/display-name
    internalLink: ({children, mark}) => {
      if (mark.reference) {
        return (
          <Link className='anchor' to={getBlogUrl(mark.reference.publishedAt, mark.reference.slug)}>
            {children}
          </Link>
        )
      }
      return <></>
    },
    // eslint-disable-next-line react/display-name
    link: ({mark, children}) => {
      return <a className='anchor' href={mark.href}>{children}</a>
    }
  }
}

export default serializers
