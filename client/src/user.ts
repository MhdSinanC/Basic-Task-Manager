export function getUserId(): string {
    let userId = localStorage.getItem('task_user_id');

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem('task_user_id', userId);
    }

    return userId;
}