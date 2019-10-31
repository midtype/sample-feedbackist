import { createGlobalStyle } from 'styled-components';
import * as colors from '../utils/colors';

export default createGlobalStyle`
@import url("https://use.typekit.net/wvk0xro.css");
body {
  padding: 0;
  margin: 0;
  background-color: ${colors.WHITE()};
  font-size: 1rem;
  font-family: neuzeit-grotesk, sans-serif;
  font-weight: 400;
  font-variant-ligatures: common-ligatures;
  -webkit-font-smoothing: antialiased;
}
body * {
  box-sizing: border-box;
}
input, p, li {
  font-size: .875rem;
  font-family: neuzeit-grotesk, sans-serif;
  font-weight: 400;
}
h1,h2,h3,h4,h5 {
  margin: 0;
  padding: 0;
  font-weight: bold;
  color: ${colors.PURPLE_DARK()};
}
h1 {
  font-size: 4rem;
  line-height: 4rem;
}
h2 {
  font-size: 3rem;
  line-height: 3rem;
}
h3 {
  font-size: 2.5rem;
}
h4 {
  font-size: 1.5rem;
}
h5 {
  font-size: 1.2rem;
}
p {
  margin: 0 0 10px 0;
  color: ${colors.GRAY_4()};
  font-size: 1.2rem;
  line-height: 1.7rem;
}
p.large {
  font-size: 1.5rem;
  line-height: 2.25rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}
label {
  font-weight: 600;
  font-size: .8rem;
  color: ${colors.BLUE_DARK()};
}
a, button {
  font-family: neuzeit-grotesk, sans-serif;
  color: ${colors.PURPLE_LIGHT()};
  text-decoration: none;
  cursor: pointer;
  border: 0;
  outline: none;
  padding: 0;
}
code {
  padding: 0 5px;
  background: ${colors.GRAY_2(0.5)} !important;
  border-radius: 3px !important;
  color: ${colors.RED()} !important;
  font-family: fira-mono, monospace !important;
  font-weight: 400 !important;
  font-style: normal !important;
}
pre code {
  background: none !important;
}

/* Add line numbers to code blocks */
.vscode-highlight {
  counter-reset: line;
}
.vscode-highlight-line::before {
  counter-increment: line;
  content: counter(line);
  margin-right: 16px;
  margin-left: -8px;
  -webkit-user-select: none;
  user-select: none;
  color: ${colors.GRAY_3(0.5)};
}

.flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 1fr;
}
/* Helper text styles. */
.text-purple {
  color: ${colors.PURPLE_DARK()};
}
.text-red {
  color: ${colors.RED()};
}
.text-accent {
  font-weight: 400;
  font-family: flood-std, sans-serif;
}
.text-gray {
  color: ${colors.GRAY_3()};
}
.text-caps {
  text-transform: uppercase;
  letter-spacing: 2px;
}
.text-small {
  font-size: .75rem;
  line-height: 1rem;
}
.text-no-margin {
  margin: 0;
}
/* Only for homepage GraphiQL demo. */
.CodeMirror-hints.graphiql {
  display: initial;
}
@keyframes fadeup {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}
@keyframes scalein {
  from {
    opacity: 0;
    transform: scale(1.2);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
@media screen and (max-width: 1024px) {
  html {
    font-size: 75%;
  }
  h2 {
    font-size: 2.5rem;
  }
  .drop-at-med {
    display: none;
  }
}
@media screen and (max-width: 400px) {
  html {
    font-size: 70%;
  }
  p {
    font-size: 1.2rem;
    line-height: 1.8rem;
  }
  .text-small {
    font-size: 1rem;
    line-height: 1.25rem;
  }
  .drop-at-small {
    display: none;
  }
}
`;
