import PropTypes from 'prop-types';
import styled from 'styled-components';
import { InferPropTypes } from '../types';

const ButtonPropTypes = {
  primary: PropTypes.bool,
};
const ButtonDefaultTypes = {
  primary: false,
};

type ButtonProps = InferPropTypes<
  typeof ButtonPropTypes,
  typeof ButtonDefaultTypes
>;

const Button = styled.button<ButtonProps>`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? 'palevioletred' : 'white')};
  color: ${(props) => (props.primary ? 'white' : 'palevioletred')};

  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

Button.propTypes = ButtonPropTypes;
Button.defaultProps = ButtonDefaultTypes;

export { Button, ButtonProps };
