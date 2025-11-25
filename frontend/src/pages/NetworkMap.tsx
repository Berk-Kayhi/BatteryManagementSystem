import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
    ReactFlow,
    applyNodeChanges,
    type Node,
    Controls,
    Background,
    BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
    { id: 'TK1', position: { x: 150, y: 80 }, data: { label: 'TK1' }, style: { background: '#fbbf24', color: '#78350f', border: '2px solid #f59e0b', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'TK2', position: { x: 420, y: 180 }, data: { label: 'TK2' }, style: { background: '#fbbf24', color: '#78350f', border: '2px solid #f59e0b', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'TK3', position: { x: 280, y: 320 }, data: { label: 'TK3' }, style: { background: '#fbbf24', color: '#78350f', border: '2px solid #f59e0b', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'AST1', position: { x: 550, y: 90 }, data: { label: 'AST1' }, style: { background: '#60a5fa', color: '#1e3a8a', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'AST2', position: { x: 100, y: 280 }, data: { label: 'AST2' }, style: { background: '#34d399', color: '#064e3b', border: '2px solid #10b981', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'AST3', position: { x: 480, y: 380 }, data: { label: 'AST3' }, style: { background: '#60a5fa', color: '#1e3a8a', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'AST5', position: { x: 350, y: 450 }, data: { label: 'AST5' }, style: { background: '#60a5fa', color: '#1e3a8a', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
    { id: 'AST6', position: { x: 200, y: 150 }, data: { label: 'AST6' }, style: { background: '#60a5fa', color: '#1e3a8a', border: '2px solid #3b82f6', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } },
];

const initialEdges = [
    { id: 'TK1-TK2', source: 'TK1', target: 'TK2', animated: true },
    { id: 'TK2-TK3', source: 'TK2', target: 'TK3', animated: true },
    { id: 'AST1-AST2', source: 'AST1', target: 'AST2', animated: true },
    { id: 'AST2-AST3', source: 'AST2', target: 'AST3', animated: true },
    { id: 'TK1-AST1', source: 'TK1', target: 'AST1', animated: true },
    { id: 'TK2-AST2', source: 'TK2', target: 'AST2', animated: true },
    { id: 'TK3-AST3', source: 'TK3', target: 'AST3', animated: true },
    { id: 'AST3-AST5', source: 'AST3', target: 'AST5', animated: true },
    { id: 'AST6-TK1', source: 'AST6', target: 'TK1', animated: true },
];

const ast2EssList = [
    { id: 'ESS-1', name: 'Energy Storage System 1', status: 'Aktif' },
];

export default function NetworkMap() {
    const navigate = useNavigate();
    const [nodes, setNodes] = useState(initialNodes);
    const [edges] = useState(initialEdges);
    const [showEssPopup, setShowEssPopup] = useState(false);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );

    const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        if (node.id === 'AST2') {
            setSelectedNode(node.id);
            setShowEssPopup(true);
        } else {
            toast.error(`${node.data.label} Bu node'a bağlı herhangi bir ESS bulunmamaktadır.`);
        }
    }, []);

    const handleEssClick = (essId: string) => {
        if (essId === 'ESS-1') {
            navigate('/sensors');
        } else {
            toast.error(`${essId} için sensör verisi henüz mevcut değil.`);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#fff',
                        color: '#333',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid #f53a0bff',
                        fontWeight: 'bold',
                    },
                }}
            />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodeClick={onNodeClick}
                nodesDraggable={true}
                nodesConnectable={false}
                edgesFocusable={false}
                elementsSelectable={false}
                fitView={true}
                fitViewOptions={{ padding: 0.2 }}
            >
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>

            {showEssPopup && selectedNode === 'AST2' && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowEssPopup(false)}
                >
                    <div
                        className="w-full max-w-md rounded-3xl border-3 bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">AST2 - ESS Listesi</h2>
                            <button
                                onClick={() => setShowEssPopup(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600 transition hover:bg-red-200"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <p className="mb-4 text-sm text-gray-600">
                            Bu node'a bağlı Energy Storage System'ler:
                        </p>

                        <div className="space-y-3">
                            {ast2EssList.map((ess) => (
                                <button
                                    key={ess.id}
                                    onClick={() => handleEssClick(ess.id)}
                                    className="group w-full rounded-2xl border-2 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-amber-500 hover:bg-amber-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{ess.id}</p>
                                            <p className="text-sm text-gray-600">{ess.name}</p>
                                            <div className="mt-1 flex gap-3 text-xs text-gray-500">
                                                <span className={ess.status === 'Aktif' ? 'text-green-600' : 'text-orange-600'}>
                                                    ● {ess.status}
                                                </span>
                                            </div>
                                        </div>
                                        <i className="ri-arrow-right-line text-2xl text-gray-400 transition group-hover:text-amber-600"></i>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
