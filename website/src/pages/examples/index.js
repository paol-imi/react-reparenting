import React from 'react';
import Layout from '@theme/Layout'; // eslint-disable-line
import classnames from 'classnames';
import styles from './styles.module.css';

const TITLE = 'Showcase';
const DESCRIPTION = <>See the examples</>;

const examples = [
  {
    type: 'Example',
    name: 'Reparentable',
    id: 'rvfi4',
    description: 'Example showing how to implement reparenting.',
  },
  {
    type: 'Example',
    name: 'React-DnD',
    id: '5u458',
    description: 'Drag and drop implementation with React-DnD.',
  },
].map((example) => ({
  type: example.type,
  title: `${example.type} - ${example.name}`,
  description: example.description,
  preview: `https://screenshots.codesandbox.io/${example.id.toLowerCase()}.png`,
  website: `https://${example.id}.csb.app/`,
  source: `https://codesandbox.io/s/react-reparenting-${example.name.toLowerCase()}-${
    example.id
  }`,
}));

function Showcase() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <div className="container margin-vert--lg">
        <div className="text--center margin-bottom--xl">
          <h1 style={{fontSize: '46px'}}>{TITLE}</h1>
          <p style={{fontSize: '25px'}}>{DESCRIPTION}</p>
        </div>
        <div className="row">
          {examples.map((example) => (
            <div key={example.title} className="col col--4 margin-bottom--lg">
              <div className={classnames('card', styles.showcaseCard)}>
                <div className="card__image">
                  <img src={example.preview} alt={example.title} />
                </div>
                <div className="card__body">
                  <div className="avatar">
                    <div className="avatar__intro margin-left--none">
                      <h4 className="avatar__name">{example.title}</h4>
                      <small className="avatar__subtitle">
                        {example.description}
                      </small>
                    </div>
                  </div>
                </div>
                {(example.website || example.source) && (
                  <div className="card__footer">
                    <div className="button-group button-group--block">
                      {example.website && (
                        <a
                          className="button button--small button--secondary button--block"
                          href={example.website}
                          target="_blank"
                          rel="noreferrer noopener">
                          Website
                        </a>
                      )}
                      {example.source && (
                        <a
                          className="button button--small button--secondary button--block"
                          href={example.source}
                          target="_blank"
                          rel="noreferrer noopener">
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Showcase;
