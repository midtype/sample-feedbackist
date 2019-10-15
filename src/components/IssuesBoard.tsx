import React from 'react';
import styled from 'styled-components';

import Issue from './Issue';

interface IIssuesBoardProps {
  issues: IIssue[];
}

const Styled = styled.div``;

const IssuesBoard: React.FC<IIssuesBoardProps> = props => {
  const { issues } = props;
  return (
    <Styled>
      {issues.map(issue => (
        <Issue key={issue.id} {...issue} />
      ))}
    </Styled>
  );
};

export default IssuesBoard;
