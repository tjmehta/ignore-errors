import shallowContains from 'shallow-contains'

const isRegExp = (val: any): boolean =>
  Object.prototype.toString.call(val) === '[object RegExp]'
const shallowContainsComparator = (a: any, b: any) => {
  return isRegExp(b) ? b.test(a) : a === b
}

type LiteralMatchType = any
type MatchType = Record<any, LiteralMatchType> | Map<any, LiteralMatchType>
type ArgsType = [MatchType] | [string, LiteralMatchType]
type IgnoreFnType = (val: any) => null

export default function ignore(...args: ArgsType): IgnoreFnType {
  return (err: any) => {
    const match: MatchType =
      args.length === 2 ? { [args[0]]: args[1] } : args[0]
    if (shallowContains(err, match, shallowContainsComparator)) {
      // ignore
      return null
    }
    throw err
  }
}

export const ignoreMessage = (val: LiteralMatchType): IgnoreFnType =>
  ignore('message', val)
export const ignoreName = (val: LiteralMatchType): IgnoreFnType =>
  ignore('name', val)
export const ignoreStatus = (val: LiteralMatchType): IgnoreFnType =>
  ignore('status', val)
export const ignoreReason = (val: LiteralMatchType): IgnoreFnType =>
  ignore('reason', val)
export const ignoreCode = (val: LiteralMatchType): IgnoreFnType =>
  ignore('code', val)

export const ignoreAny = (...ignoreFns: Array<IgnoreFnType>) => {
  return (err: any) => {
    const somePassed = ignoreFns.some((ignoreFn) => {
      try {
        ignoreFn(err)
        return true
      } catch (err) {
        return false
      }
    })
    if (!somePassed) throw err
  }
}
