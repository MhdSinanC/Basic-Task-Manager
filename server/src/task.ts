export type Task = {
    id: number,
    title: string,
    isCompleted: boolean
}


export function isValidTask(value: unknown): boolean {

    if (
        typeof value !== 'object' || 
        value === null || 
        !('title' in value) ||
        !('isCompleted' in value) 
    ) {
        return false;
    }

    return (
        typeof value.title === 'string' &&
        value.title.trim() !== '' &&
        typeof value.isCompleted === 'boolean'
    )

}