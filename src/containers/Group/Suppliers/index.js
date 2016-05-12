import React, { Component, PropTypes } from 'react';
import { initialize } from 'redux-form';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

import CreateProducerForm from 'components/forms/producers/Create';
import { load as loadSuppliers } from 'redux/modules/suppliers/list';
import { load as loadProducers } from 'redux/modules/producers/list';
import { create } from 'redux/modules/producers/list';
import { suppliersWithProducerSelector } from 'selectors/producers';
import List from './List';

const mapStateToProps = (state) => ({
  createProducerErrors: state.producersReducer.createProducerErrors,
  suppliers: state.suppliersReducer.suppliers.entities,
  ...suppliersWithProducerSelector(state),
});

const mapDispatchToProps = { initialize, create };

@asyncConnect([{
  promise: (options) => {
    const {
      store: { dispatch },
      params: { id },
    } = options;

    const promises = [];
    promises.push(dispatch(loadSuppliers(id)));
    promises.push(dispatch(loadProducers()));

    return Promise.all(promises);
  },
}])
@connect(mapStateToProps, mapDispatchToProps)
export default class GroupSuppliers extends Component {
  static propTypes = {
    group: PropTypes.object,
    currentUser: PropTypes.object,
    suppliers: PropTypes.array.isRequired,
    producers: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    createProducerErrors: PropTypes.object,
  }

  handleSubmit(data) {
    const self = this;

    return this.props.create(data, 1).then(() => {
      const errors = self.props.createProducerErrors;

      if (Object.keys(errors).length) {
        return Promise.reject(errors);
      }

      // do something on success
      // self.props.initialize('onboardingCreateGroup', {});

      return Promise.resolve({});
    });
  }

  render() {

    const { group, producers } = this.props;

    return (
      <div>
        <Helmet title={`Proveedores de ${group.name}`}/>

        <h2>Proveedores</h2>

        <div className="row">

          <div className="col-xs-12 col-sm-6 col-sm-push-6 col-md-4 col-md-push-8">
          </div>

          <div className="col-xs-12 col-sm-6 col-sm-pull-6 col-md-8 col-md-pull-4">
            <List group={group} producers={producers} />
            <CreateProducerForm onSubmit={this.handleSubmit.bind(this)} />
          </div>

        </div>
      </div>
    );
  }
}
