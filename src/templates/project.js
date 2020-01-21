import React from "react"
import { graphql, Link } from "gatsby"
import Img from "gatsby-image"

import Clap from "../components/clap"
import Layout from "../components/layout"
import Markdown from "../components/markdown"
import RelatedProject from "../components/project"
import SEO from "../components/seo"

import { flatten, normalizeCollection } from "../utils"

import "../pages/built-with-workers-page.css"
import "./project-page.css"
import "../vendor/workers-brand-assets/css/components/definition-list.css"

const getPrimaryLinkText = (linkType) => {
  switch (linkType) {
    case "announcement": return "Read announcement";
    case "code": return "Read code";
    case "twitter": return "View on Twitter";
    case "website": return "Visit website";
    default: return "Learn more";
  }
}

const getLinkText = (linkType) => {
  switch (linkType) {
    case "announcement": return "Announcement";
    case "code": return "Code";
    case "twitter": return "Twitter";
    case "website": return "Website";
    default: return "Learn more";
  }
}

const Project = ({
  data: {
    allSanityCollection,
    allSanityFeature,
    allSanityProject,
    sanityProject: project,
  },
}) => {
  const allCollections = flatten(allSanityCollection)
  let collections = allCollections.map(collection =>
    normalizeCollection(
      collection,
      flatten(allSanityFeature),
      flatten(allSanityProject)
    )
  )

  const collectionForProject = collections.find(({ projects }) =>
    projects.find(({ id }) => id === project.id)
  )

  // TODO - implement
  let isBookmarked = Math.random() > .5
  const toggleBookmark = () => {}

  return (
    <Layout>
      <SEO title={project.name} />

      <div className="BuiltWithWorkersPage ProjectPage">
        <div className="ProjectPage--header">
          <div className="ProjectPage--header-content">
            <div className="ProjectPage--back-link">
              <Link className="Link Link-with-left-arrow Link-is-juicy" to="/built-with">Back</Link>
            </div>
            <h2 className="ProjectPage--title">{project.name}</h2>
            <p className="ProjectPage--description">{project.shortDescription}</p>
          </div>

          {project.links.length > 0 && (
            <div className="ProjectPage--header-actions">
              <div className="ProjectPage--header-action-primary">
                {[project.links[0]].map(({ linkType, url }) => (
                  <a className="ProjectPage--header-action-button Button Button-is-primary" href={url} key={url}>
                    {getPrimaryLinkText(linkType)}
                  </a>
                ))}
              </div>

              <div className="ProjectPage--header-action-bookmark" data-is-bookmarked={isBookmarked}>
                <button className="ProjectPage--header-action-button Button" onClick={toggleBookmark}>
                  <span className="ProjectPage--header-action-bookmark-icon"></span>
                  <span className="ProjectPage--header-action-bookmark-text">{isBookmarked?'Remove':'Bookmark'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="ProjectPage--image">
          <Img fluid={project.image.asset.fluid} />
        </div>

        {project.longDescription && (
          <div className="ProjectPage--body">
            <div className="ProjectPage--about">
              <Markdown source={project.longDescription}/>
            </div>

            {(project.developer || project.links.length > 0) && (
              <div className="ProjectPage--metadata">
                <dl className="DefinitionList">
                  {project.developer && (
                    <>
                      <dt className="DefinitionList--term">Developer</dt>
                      <dd className="DefinitionList--definition">{project.developer}</dd>
                    </>
                  )}
                  {project.links.length > 0 && (
                    <>
                      <dt className="DefinitionList--term">Links</dt>
                      <dd className="DefinitionList--definition">
                        {project.links.map(({ linkType, url }) => (
                          <span className="ProjectPage--metadata-link" key={url}>
                            <a className="Link Link-with-right-arrow" href={url}>
                              {getLinkText(linkType)}
                            </a>
                          </span>
                        ))}
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            )}
          </div>
        )}

        <div className="ProjectPage--more">
          <div className="Collection Collection-is-centered">
            <div className="Collection--header">
              <h2 className="Collection--title">Also built with Workers...</h2>
            </div>

            <div className="Collection--projects">
              {collectionForProject && collectionForProject.projects
                .filter(({ id }) => id !== project.id)
                .map(project => (
                  <div className="Collection--project" key={project.id}>
                    <RelatedProject project={project} />
                  </div>
                ))}

              <div className="Collection--spacer" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query ProjectPage($slug: String!) {
    sanityProject(slug: { eq: $slug }) {
      ...Project
    }

    allSanityFeature {
      edges {
        node {
          ...Feature
        }
      }
    }

    allSanityProject {
      edges {
        node {
          ...Project
        }
      }
    }

    allSanityCollection {
      edges {
        node {
          ...Collection
          feature {
            ...Feature
          }

          projects {
            ...Project
          }
        }
      }
    }
  }
`

export default Project
