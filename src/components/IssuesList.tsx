import React from 'react';
import styled from 'styled-components';

import Issue from './Issue';
import IssueCreate from './IssueCreate';

interface IIssuesListProps {
  issues: IIssue[];
}

const Styled = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 2rem;
`;

const IssuesList: React.FC<IIssuesListProps> = props => {
  const { issues } = props;
  return (
    <Styled>
      <div className="issues__create">
        <IssueCreate />
      </div>
      <div className="issues__list">
        {issues.map(issue => (
          <Issue key={issue.id} {...issue} />
        ))}
      </div>
    </Styled>
  );
};

export default IssuesList;
