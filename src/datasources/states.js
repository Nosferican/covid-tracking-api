const _ = require('lodash/fp')
const { setFieldWith } = require('prairie')
const { sheets } = require('./sheets')
const { totalDate } = require('./utils')
const { runSearch, sheetVals } = require('../handlers/sheets')
const { handleResponse } = require('../handlers/responses')

const states = {
  ...sheets,
  sheetName: 'States current',
  fixItems: _.map(_.flow(
    setFieldWith('dateModified', 'lastUpdateEt', totalDate),
    setFieldWith('dateChecked', 'checkTimeEt', totalDate),
  )),
}

const grade = {
  ...sheets,
  worksheetId: '1_6zwoekv0Mzpp6KEp4OziZizaWxGOxMoDT2C-iBvyEg',
  sheetName: 'Sheet1',
  fixItems: _.flow(
    _.compact,
    _.map(_.omit(['timeOfLastStateUpdateEt', 'lastCheckTimeEt', 'checker', 'doubleChecker'])),
    _.keyBy('state'),
  ),
}

const getStates = (event, args) => Promise.all([
  sheetVals(grade, {}),
  sheetVals(states, {}).then(_.keyBy('state')),
])
  .then(_.flow(_.mergeAll, _.values, _.filter('state')))
  .then(runSearch(args.search))
  .then(handleResponse(args))

module.exports = {
  grade,
  states: getStates,
}
