import dayjs from 'dayjs'
import 'dayjs/plugin/timezone'
import 'dayjs/plugin/isSameOrAfter'
import 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import 'dayjs/locale/ja'
dayjs.locale('ja')

export default dayjs
