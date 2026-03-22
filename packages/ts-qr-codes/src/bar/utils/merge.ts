export const merge: (old: any, replaceObj: any) => any = (old, replaceObj) => ({ ...old, ...replaceObj })

export default merge
