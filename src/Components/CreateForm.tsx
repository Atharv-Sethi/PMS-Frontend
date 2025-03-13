import React, { useState, useEffect } from 'react';
import axios from 'axios';

type ItemType = 'theme' | 'initiative' | 'epic' | 'bug' | 'story' | 'task';

interface Item {
    id: string;
    name: string;
}

export default function CreateForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<ItemType | ''>('');
    const [deadline, setDeadline] = useState('');
    const [parentTheme, setParentTheme] = useState('');
    const [parentInitiative, setParentInitiative] = useState('');
    const [parentEpic, setParentEpic] = useState('');
    const [parentStory, setParentStory] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [sprintId, setSprintId] = useState('');

    const [themes, setThemes] = useState<Item[]>([]);
    const [initiatives, setInitiatives] = useState<Item[]>([]);
    const [epics, setEpics] = useState<Item[]>([]);
    const [stories, setStories] = useState<Item[]>([]);
    const [sprints, setSprints] = useState<Item[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const project = JSON.parse(localStorage.getItem('project') || '{}');
    const token = localStorage.getItem('token');
    const projectId = project.id;

    useEffect(() => {
        if (projectId) {
            fetchThemes();
        }
    }, [projectId]);

    useEffect(() => {
        if (parentTheme) {
            fetchInitiatives();
            setParentInitiative('');
            setParentEpic('');
            setParentStory('');
        }
    }, [parentTheme]);

    useEffect(() => {
        if (parentInitiative) {
            fetchEpics();
            setParentEpic('');
            setParentStory('');
        }
    }, [parentInitiative]);

    useEffect(() => {
        if (parentEpic) {
            fetchStories();
            setParentStory('');
        }
    }, [parentEpic]);

    useEffect(() => {
        if (type === 'story') {
            fetchSprints();
        }
    }, [type]);

    const fetchThemes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/themes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setThemes(response.data);
        } catch (err) {
            setError('Failed to fetch themes');
        }
        setIsLoading(false);
    };

    const fetchInitiatives = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/themes/${parentTheme}/initiatives`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setInitiatives(response.data);
        } catch (err) {
            setError('Failed to fetch initiatives');
        }
        setIsLoading(false);
    };

    const fetchEpics = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/themes/${parentTheme}/initiatives/${parentInitiative}/epics`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setEpics(response.data);
        } catch (err) {
            setError('Failed to fetch epics');
        }
        setIsLoading(false);
    };

    const fetchStories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/themes/${parentTheme}/initiatives/${parentInitiative}/epics/${parentEpic}/stories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setStories(response.data);
        } catch (err) {
            setError('Failed to fetch stories');
        }
        setIsLoading(false);
    };

    const fetchSprints = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/sprints`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setSprints(response.data);
        } catch (err) {
            setError(`Failed to fetch sprints, ${err}`);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let url = `http://localhost:8000/api/projects/${projectId}/`;
            const data: any = { name, description };
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            switch (type) {
                case 'theme':
                    url += 'themes';
                    break;
                case 'initiative':
                    url += `themes/${parentTheme}/initiatives`;
                    break;
                case 'epic':
                    url += `themes/${parentTheme}/initiatives/${parentInitiative}/epics`;
                    break;
                case 'bug':
                case 'story':
                    url += `themes/${parentTheme}/initiatives/${parentInitiative}/epics/${parentEpic}/stories`;
                    data.type = type;
                    if (type === 'story') {
                        data.sprint_id = sprintId; // Add sprint_id for stories
                    }
                    break;
                case 'task':
                    url += `themes/${parentTheme}/initiatives/${parentInitiative}/epics/${parentEpic}/stories/${parentStory}/tasks`;
                    break;
                default:
                    throw new Error('Invalid type');
            }

            if (type !== 'initiative') {
                data.deadline = deadline;
            }

            if (assignedTo) {
                data.assigned_to = assignedTo;
            }

            await axios.post(url, data, config);
            // Reset form or show success message
            setName('');
            setDescription('');
            setType('');
            setDeadline('');
            setParentTheme('');
            setParentInitiative('');
            setParentEpic('');
            setParentStory('');
            setAssignedTo('');
            setSprintId(''); // Reset sprint id
        } catch (err) {
            setError(`Failes to submit, ${err}`);
        }

        setIsLoading(false);
    };

    if (!projectId) {
        return <div>No project selected. Please select a project first.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            {error && <div className="text-red-500">{error}</div>}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>

            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value as ItemType)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Select type</option>
                    <option value="theme">Theme</option>
                    <option value="initiative">Initiative</option>
                    <option value="epic">Epic</option>
                    <option value="bug">Bug</option>
                    <option value="story">Story</option>
                    <option value="task">Task</option>
                </select>
            </div>

            {type && type !== 'theme' && (
                <div>
                    <label htmlFor="parentTheme" className="block text-sm font-medium text-gray-700">Parent Theme</label>
                    <select
                        id="parentTheme"
                        value={parentTheme}
                        onChange={(e) => setParentTheme(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Select Parent Theme</option>
                        {themes.map((theme) => (
                            <option key={theme.id} value={theme.id}>{theme.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {type && ['epic', 'bug', 'story', 'task'].includes(type) && parentTheme && (
                <div>
                    <label htmlFor="parentInitiative" className="block text-sm font-medium text-gray-700">Parent Initiative</label>
                    <select
                        id="parentInitiative"
                        value={parentInitiative}
                        onChange={(e) => setParentInitiative(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Select Parent Initiative</option>
                        {initiatives.map((initiative) => (
                            <option key={initiative.id} value={initiative.id}>{initiative.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {type && ['bug', 'story', 'task'].includes(type) && parentInitiative && (
                <div>
                    <label htmlFor="parentEpic" className="block text-sm font-medium text-gray-700">Parent Epic</label>
                    <select
                        id="parentEpic"
                        value={parentEpic}
                        onChange={(e) => setParentEpic(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Select Parent Epic</option>
                        {epics.map((epic) => (
                            <option key={epic.id} value={epic.id}>{epic.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {type === 'task' && parentEpic && (
                <div>
                    <label htmlFor="parentStory" className="block text-sm font-medium text-gray-700">Parent Story</label>
                    <select
                        id="parentStory"
                        value={parentStory}
                        onChange={(e) => setParentStory(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Select Parent Story</option>
                        {stories.map((story) => (
                            <option key={story.id} value={story.id}>{story.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {type === 'story' && (
                <div>
                    <label htmlFor="sprintId" className="block text-sm font-medium text-gray-700">Sprint</label>
                    <select
                        id="sprintId"
                        value={sprintId}
                        onChange={(e) => setSprintId(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Select Sprint</option>
                        {sprints.map((sprint) => (
                            <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {type && type !== 'initiative' && (
                <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                    <input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
            )}

            {type && ['bug', 'story', 'task'].includes(type) && (
                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned To</label>
                    <input
                        id="assignedTo"
                        type="number"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isLoading ? 'Submitting...' : 'Create'}
            </button>
        </form>
    );
}