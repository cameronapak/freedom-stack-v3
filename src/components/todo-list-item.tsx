type Props = {
  todoId: string
  title: string
  checked?: boolean
}

export function TodoListItem({ todoId, title, checked = false }: Props) {
  return (
    <li
      id={`#task-${todoId}`}
      class="group/item flex items-center border text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border-transparent p-2 gap-4"
    >
      <label data-on:click={`@post('/toggle-todo/${todoId}/${!checked}')`} class="label gap-3">
        <input type="checkbox" class="input" checked={checked} />
        {title}
      </label>
    </li>
  )
}
