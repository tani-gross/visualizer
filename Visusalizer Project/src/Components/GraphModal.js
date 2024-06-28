import React, { useState } from 'react';

const GraphModal = ({ show, onClose, onGenerateGraph }) => {
    const [nodeCount, setNodeCount] = useState(0);
    const [edgeCount, setEdgeCount] = useState(0);
    const [isDirected, setIsDirected] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerateGraph(nodeCount, edgeCount, isDirected);
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Generate Graph</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Number of Nodes:
                        <input 
                            type="number" 
                            value={nodeCount} 
                            onChange={(e) => setNodeCount(parseInt(e.target.value))} 
                            min="1" max="20" required 
                            style={{ width: '50px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Number of Edges:
                        <input 
                            type="number" 
                            value={edgeCount} 
                            onChange={(e) => setEdgeCount(parseInt(e.target.value))} 
                            min="0" max={isDirected ? (nodeCount * (nodeCount - 1)) : (nodeCount * (nodeCount - 1)) / 2} required 
                            style={{ width: '50px' }}
                        />
                    </label>
                    <br />
                    <label>
                        Directed: 
                        <input 
                            type="checkbox" 
                            checked={isDirected} 
                            onChange={(e) => setIsDirected(e.target.checked)} 
                        />
                    </label>
                    <br />
                    <button type="submit">Generate</button>
                </form>
            </div>
        </div>
    );
};

export default GraphModal;
