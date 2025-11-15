import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AnimatePresence, motion } from 'framer-motion';
import TodoItem from './TodoItem';

type Todo = { id: number; text: string; completed: boolean; dueDate?: string };

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, text: string) => void;
    onEditDueDate: (id: number, dueDate: string) => void;
    onDragEnd: (result: any) => void;
}

const TodoList: React.FC<TodoListProps> = ({
    todos, onToggle, onDelete, onEdit, onEditDueDate, onDragEnd
}) => (
    <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
            {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                    <AnimatePresence>
                        {todos.map((todo, index) => (
                            <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                                {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TodoItem
                                                id={todo.id}
                                                text={todo.text}
                                                completed={todo.completed}
                                                dueDate={todo.dueDate}
                                                onToggle={onToggle}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                                onEditDueDate={onEditDueDate}
                                            />
                                        </motion.div>
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </AnimatePresence>
                </ul>
            )}
        </Droppable>
    </DragDropContext>
);

export default TodoList;