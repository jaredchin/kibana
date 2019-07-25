/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  InfraMetricModelCreator,
  InfraMetricModelMetricType,
  InfraMetricModel,
} from '../../adapter_types';
import { InfraMetric } from '../../../../../graphql/types';

export const nginxRequestsPerConnection: InfraMetricModelCreator = (
  timeField,
  indexPattern,
  interval
): InfraMetricModel => ({
  id: InfraMetric.nginxRequestsPerConnection,
  requires: ['nginx.stubstatus'],
  index_pattern: indexPattern,
  interval,
  time_field: timeField,
  type: 'timeseries',
  series: [
    {
      id: 'reqPerConns',
      metrics: [
        {
          field: 'nginx.stubstatus.handled',
          id: 'max-handled',
          type: InfraMetricModelMetricType.max,
        },
        {
          field: 'nginx.stubstatus.requests',
          id: 'max-requests',
          type: InfraMetricModelMetricType.max,
        },
        {
          id: 'reqs-per-connection',
          type: InfraMetricModelMetricType.calculation,
          variables: [
            { id: 'var-handled', name: 'handled', field: 'max-handled' },
            { id: 'var-requests', name: 'requests', field: 'max-requests' },
          ],
          script:
            'params.handled > 0.0 && params.requests > 0.0 ? params.handled / params.requests : 0.0',
        },
      ],
      split_mode: 'everything',
    },
  ],
});
