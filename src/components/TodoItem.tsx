import React, { useState } from 'react';

interface TodoItemProps {
    id: number;
    text: string;
    completed: boolean;
    dueDate?: string;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number, text: string) => void;
    onEditDueDate: (id: number, dueDate: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    id, text, completed, dueDate, onToggle, onDelete, onEdit, onEditDueDate
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(text);
    const [editDue, setEditDue] = useState(dueDate || '');

    const handleEdit = () => {
        onEdit(id, editValue);
        setIsEditing(false);
    };

    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditDue(e.target.value);
        onEditDueDate(id, e.target.value);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <input
                type="checkbox"
                checked={completed}
                onChange={() => onToggle(id)}
            />
            {isEditing ? (
                <>
                    <input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleEdit()}
                        autoFocus
                    />
                    <button onClick={handleEdit}>Save</button>
                </>
            ) : (
                <span
                    style={{
                        marginLeft: 8,
                        marginRight: 8,
                        transition: 'text-decoration 0.3s',
                        textDecoration: completed ? 'line-through' : 'none',
                        flex: 1,
                        cursor: 'pointer'
                    }}
                    onDoubleClick={() => setIsEditing(true)}
                >
                    {text}
                </span>
            )}
            <input
                type="date"
                value={editDue}
                onChange={handleDueDateChange}
                style={{ marginRight: 8 }}
            />
            {dueDate && (
                <span style={{ fontSize: '0.8em', color: '#888', marginRight: 8 }}>
                    {dueDate}
                </span>
            )}
            <button onClick={() => onDelete(id)}>Delete</button>
        </div>
    );
};

export default TodoItem;