import React from 'react';
import PropTypes from 'prop-types';
import Viewport from 'cf-component-viewport';
import Select from 'cf-component-select';
import { createComponent } from 'cf-style-container';

const find = (list, condition) => {
  let foundElement = undefined;
  list.forEach(element => {
    if (condition(element)) {
      foundElement = element;
    }
  });
  return foundElement;
};

const styles = ({ theme }) => ({
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
  border: `1px solid ${theme.color.smoke}`
});

const TabsGroup = createComponent(
  () => ({
    display: 'flex',
    width: '100%',
    margin: 0,
    padding: 0,
    listStyle: 'none'
  }),
  'ul',
  ['role']
);

const TabItem = createComponent(
  ({ theme, selected }) => ({
    flex: theme.item.flex,
    background: theme.item.background,
    color: theme.item.color,
    cursor: theme.item.cursor,
    display: theme.item.display,
    margin: theme.item.margin,
    padding: theme.item.padding,
    position: theme.item.position,
    textAlign: theme.item.textAlign,
    verticalAlign: theme.item.verticalAlign,
    outline: theme.item.outline,
    userSelect: theme.item.userSelect,

    borderStyle: theme.item.borderStyle,
    borderTopWidth: selected
      ? theme.item.borderTopWidthSelected
      : theme.item.borderTopWidth,
    borderLeftWidth: theme.item.borderLeftWidth,
    borderBottomWidth: selected
      ? theme.item.borderBottomWidthSelected
      : theme.item.borderBottomWidth,
    borderRightWidth: theme.item.borderRightWidth,
    borderTopColor: selected
      ? theme.item.borderTopColorSelected
      : theme.item.borderTopColor,
    borderLeftColor: theme.item.borderLeftColor,
    borderBottomColor: theme.item.borderBottomColor,
    borderRightColor: theme.item.borderRightColor,

    '&:last-child': {
      borderRightWidth: theme.item['&:last-child'].borderRightWidth
    },

    '&:focus': {
      '&::after': {
        outline: theme.item['&:focus']['&::after'].outline
      }
    },

    '&:hover': {
      background: selected
        ? theme.item['&:hover'].backgroundSelected
        : theme.item['&:hover'].background,
      color: theme.item['&:hover'].color
    }
  }),
  'li',
  [
    'selected',
    'key',
    'role',
    'tabIndex',
    'aria-controls',
    'aria-selected',
    'onKeyDown',
    'onClick'
  ]
);

class Tabs extends React.Component {
  getChildContext() {
    return {
      active: this.props.active
    };
  }

  handleChange(id) {
    if (id !== this.props.active) {
      this.props.onChange(id);
    }
  }

  handleKeyDown(id, event) {
    if (event.which === 13) {
      this.handleChange(id);
    }
  }

  render() {
    return (
      <section className={this.props.className}>
        <Viewport size="mobile">
          <Select
            onChange={this.handleChange.bind(this)}
            value={this.props.active}
            options={this.props.tabs.map(tab => {
              return {
                value: tab.id,
                label: tab.label
              };
            })}
          />
        </Viewport>
        <Viewport not size="mobile">
          <TabsGroup role="tablist">
            {this.props.tabs.map(tab => {
              const selected = tab.id === this.props.active;
              return (
                <TabItem
                  selected={selected}
                  key={tab.id}
                  role="tab"
                  tabIndex={0}
                  aria-controls={tab.id}
                  aria-selected={selected}
                  onKeyDown={this.handleKeyDown.bind(this, tab.id)}
                  onClick={this.handleChange.bind(this, tab.id)}
                >
                  {tab.label}
                </TabItem>
              );
            })}
          </TabsGroup>
        </Viewport>
        {find(this.props.children, child => {
          return child.props.id === this.props.active;
        })}
      </section>
    );
  }
}

Tabs.propTypes = {
  onChange: PropTypes.func.isRequired,
  active: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired
};

Tabs.childContextTypes = {
  active: PropTypes.string.isRequired
};

export default createComponent(styles, Tabs);
