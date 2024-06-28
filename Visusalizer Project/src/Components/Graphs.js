import React, {useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';
import {calculateAngle, calculateEdgeLength, calculateMidpoint} from './GraphUtilities';
import UnionFind from "./UnionFind"
import GraphModal from './GraphModal';


const Graphs = () => {
    const [text, setText] = useState("Add Node or Generate Graph to Begin");
    const [nodes, setNodes] = useState([]);
    const [nodeCount, setNodeCount] = useState(0);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isAddingEdge, setIsAddingEdge] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [isRemovingEdge, setIsRemovingEdge] = useState(false);
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [visitedEdges, setVisitedEdges] = useState([]);
    const [adjList, setAdjList] = useState([]);
    const [clickedTraversal, setClickedTraversal] = useState(false);
    const [clickedMST, setClickedMST] = useState(false);
    const [clickedPaths, setClickedPaths] = useState(false);
    const [isDFS, setIsDFS] = useState(false);
    const [isBFS, setIsBFS] = useState(false);
    const [isPrim, setIsPrim] = useState(false);
    const [isTSP, setIsTSP] = useState(false);
    const [algorithmRunning, setAlgorithmRunning] = useState(false);
    const [isShortestPath, setIsShortestPath] = useState(false);
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const componentColors = ["blue", "green", "orange", "purple", "pink", "yellow", "gold", "coral", "crimson", "cyan", "darkgreen", "drakblue", "darkorange", "darkorchid", "darkred", "deeppink", "darkviolet", "deepskyblue", "forestgreen", "fuchsia"];
    const [components, setComponents] = useState([]);
    const [showWeights, setShowWeights] = useState(false);
    const [sliderValue, setSliderValue] = useState(250);
    const [currentNode, setCurrentNode] = useState(null);
    const sliderValueRef = useRef(sliderValue);
    const totalSliderCount = 2100;
    const [isPaused, setIsPaused] = useState(false);
    const isPausedRef = useRef(isPaused);
    const [currentStep, setCurrentStep] = useState(0);
    const currentStepRef = useRef(currentStep);
    const [isStepMode, setIsStepMode] = useState(false);
    const isStepModeRef = useRef(isStepMode);
    const [disablePause, setDisablePause] = useState(false);
    const [algorithmStarted, setAlgorithmStarted] = useState(false);
    const [runningAlgorithm, setRunningAlgorithm] = useState(null);
    const [isDirected, setIsDirected] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldStop, setShouldStop] = useState(false);
    const shouldStopRef = useRef(shouldStop);

    // Constants for UI text and colors
    const highlightedButtonColor = "lightblue";
    const startingText = "Move Node, Select Node, or Press Button to Continue";
    const treeEdgeColor = "blue";
    const currentEdgeColor = "red";
    const defaultEdgeColor = "grey";

    // Use Effect to Stop Algorithm
    useEffect(() => {
        shouldStopRef.current = shouldStop;
    }, [shouldStop])

    // Use Effect to differentiate between modes
    useEffect(() => {
        isStepModeRef.current = isStepMode;
    }, [isStepMode]);

    // Use sEffect to allow pausing mid-alg
    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    // Use Effect to allow stopping mid-alg
    useEffect(() => {
        currentStepRef.current = currentStepRef;
    }, [currentStepRef]);

    // Function to reset edges to default state
    const resetEdges = () => {
        setVisitedEdges([]);
        setVisitedNodes([]);
        setText(startingText);
        setAlgorithmRunning(false);
        setCurrentStep(0);
        currentStepRef.current = 0;
        setDisablePause(false);
        setRunningAlgorithm(null);
        setShouldStop(false);
    };

    // Function to set traversal mode
    const setClickTraversal = () => {
        if(algorithmRunning){
            return;
        }

        setClickedTraversal(true);
    }

    // Function to set MST mode
    const setClickMST = () => {
        if(algorithmRunning){
            return;
        }

        setClickedMST(true);
    }

    // Function to set Paths mode
    const setClickPath = () => {
        if(algorithmRunning){
            return;
        }

        setClickedPaths(true);
    }

    // Functino to go back from algorithm selection
    const goBack = () => {

        if(algorithmRunning || isRemovingEdge){
            return;
        }
        
        setClickedMST(false);
        setClickedTraversal(false);
        setClickedPaths(false);
        setAlgorithmRunning(false);
        setText(startingText);
    }

    // Function to step in the algorithm
    const nextStep = () => {
        if(isPausedRef.current){
            setIsStepMode(true);
            if(isPausedRef.current){
                setCurrentStep(prev => {
                    const next = prev + 1;
                    currentStepRef.current = next;
                    return next;
                });
            }
            setIsPaused(false);
            isPausedRef.current = false;
        }
    };

    // Function to toggle button 
    const togglePlayPause = () => {
        if (isPausedRef.current) {
            setIsStepMode(false);
            setIsPaused(false);
            isPausedRef.current = false;
            switch (runningAlgorithm) {
                case "DFS":
                    setText("DFS in progress...")
                    break;
                case "BFS":
                    setText("BFS in progress...")
                    break;
                case "Kruskall":
                    setText("Kruskall's Algorithm in progress...")
                    break;
                case "Prim":
                    setText("Prim's Algorithm in progress...")
                    break;
                case "SP":
                    setText("Shortest Path Algorithm in progress...")
                    break;
                case "TSP":
                    setText("TSP in progress...")
                    break;
                case "Connected":
                    setText("Connected Components in progress..")
                    break;
                case "Colors":
                    setText("Graph Coloring in progress...")
                    break;
                default:
                    setText("Shouldn't get here");
                }
        } else {
            setIsStepMode(false);
            setIsPaused(true);
            isPausedRef.current = true;
            setText("Algorithm is Paused");
        }
    };
    
    // Function to switch between directed and undirected graphs
    const toggleGraphType = () => {
        if(algorithmRunning){
            return;
        }
        if (isDirected) {
            const consolidatedEdges = [];
            const edgeSet = new Set();
    
            edges.forEach(edge => {
                const edgeKey = `${Math.min(edge.from.id, edge.to.id)}-${Math.max(edge.from.id, edge.to.id)}`;
                if (!edgeSet.has(edgeKey)) {
                    edgeSet.add(edgeKey);
                    consolidatedEdges.push(edge);
                }
            });
    
            const newAdjList = {};
            consolidatedEdges.forEach(edge => {
                if (!newAdjList[edge.from.id]) newAdjList[edge.from.id] = [];
                if (!newAdjList[edge.to.id]) newAdjList[edge.to.id] = [];
                newAdjList[edge.from.id].push(edge.to.id);
                newAdjList[edge.to.id].push(edge.from.id);
            });
    
            setEdges(consolidatedEdges);
            setAdjList(newAdjList);
        }
        setIsDirected(!isDirected);
    }

    // Function to stop algorithm from running
    const stopAlgorithm = () => {
        setShouldStop(true);
        setIsPaused(false);
        isPausedRef.current = false;
        resetEdges();
    }

    /*
        Algorithms
    */

        // Function to start DFS
    const startDFS = () => {
        if(algorithmRunning|| isRemovingEdge){
            return;
        }
        setRunningAlgorithm("DFS");
        setIsDFS(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin DFS");
    }

    // DFS implementatoin
    const dfs = async (startNode) => {
        setAlgorithmStarted(true);
        setText("DFS in progress...");

        const visitedNodeSet = new Set();
        const visitedEdgeSet = new Set();
        let stepIndex = 0;

        const dfsRecursive = async (currentNode) => {
            if (visitedNodeSet.has(currentNode.id)) {
                return;
            }
            visitedNodeSet.add(currentNode.id);
            setVisitedNodes(prev => { 
                const updatedNodes = [...prev, { id: currentNode.id, color: treeEdgeColor }];
                return updatedNodes;
            });

            for (let neighborId of adjList[currentNode.id]) {
                setCurrentNode(currentNode);     
                const neighborNode = nodes.find(node => node.id === neighborId); 
                const edge = edges.find(e =>                                     
                    (isDirected && e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (!isDirected && ((e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)))
                );

                if(!edge){
                    continue;
                }

                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
            
                if (!visitedEdgeSet.has(edge)) {
                    stepIndex++;
                    if (isPausedRef.current) {
                        // eslint-disable-next-line
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if(isStepModeRef.current){
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }

                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                }

                if (!visitedNodeSet.has(neighborId)) { 
                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: treeEdgeColor }
                    ]);
                    visitedEdgeSet.add(edge);

                    await dfsRecursive(neighborNode);
                } else {
                    setVisitedEdges(prev => prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id && e.color !== treeEdgeColor)));
                }
            }

        };

        await dfsRecursive(startNode);
        setCurrentNode(null);
        setAlgorithmStarted(false);
        setText("DFS Done!");
        setTimeout(resetEdges, 1000); 
    };

    // Function to start BFS
    const startBFS = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("BFS");
        setIsBFS(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin BFS");
    }

    // BFS implementation
    const bfs = async (startNode) => {
        setAlgorithmStarted(true);
        setText("BFS in progress...");
        const visitedNodeSet = new Set();
        const visitedEdgeSet = new Set();
        let stepIndex = 0;


        const queue = [startNode];
        visitedNodeSet.add(startNode.id);
        setVisitedNodes([{ id: startNode.id, color: treeEdgeColor }]);

        while (queue.length > 0) {
            const currentNode = queue.shift();
            setCurrentNode(currentNode);
            
            for (let neighborId of adjList[currentNode.id]) {
                const neighborNode = nodes.find(node => node.id === neighborId);
                const edge = edges.find(e =>                                     
                    (isDirected && e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (!isDirected && ((e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)))
                );

                if(!edge){
                    continue;
                }

                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);

                if(!visitedEdgeSet.has(edge)){
                    stepIndex++;
                    if (isPausedRef.current) {
                        // eslint-disable-next-line
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if(isStepModeRef.current){
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }

                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                }

                if (!visitedNodeSet.has(neighborId)) {
                    visitedNodeSet.add(neighborId);
                    queue.push(neighborNode);

                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: treeEdgeColor }
                    ]);
                    setVisitedNodes(prev => [...prev, { id: neighborId, color: treeEdgeColor }]);

                } else{
                    setVisitedEdges(prev => prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id && e.color !== treeEdgeColor)));
                }
                
            }
        }

        setCurrentNode(null);
        setAlgorithmStarted(false);
        setText("BFS Done!");
        setTimeout(resetEdges, 1000); 
    };

    // Function to start Prim's algorithm
    const startPrim = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        if(isDirected){
            toggleGraphType();
        }
        setRunningAlgorithm("Prim");
        setIsPrim(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin Prim's Algorithm");
    }

    // Function to animate Prim's algorithm
    const animatePrimsAlgorithm = async (startNode) => {
        setAlgorithmStarted(true);
        setText("Prim's Algorithm in progress...");
        const visitedNodeSet = new Set();
        const edgeQueue = [];
        let stepIndex = 0;

        const addEdges = (node) => {
            visitedNodeSet.add(node.id);
            setVisitedNodes(prev => [...prev, { id: node.id, color: treeEdgeColor }]);
            (adjList[node.id] || []).forEach(neighborId => {
                if (!visitedNodeSet.has(neighborId)) {
                    const edge = edges.find(e => 
                        (e.from.id === node.id && e.to.id === neighborId) ||
                        (e.from.id === neighborId && e.to.id === node.id)
                    );
                    if (edge) {
                        edgeQueue.push({ ...edge, length: calculateEdgeLength(edge) });
                    }
                }
            });
            edgeQueue.sort((a, b) => a.length - b.length); 
        };

        const animateStep = async () => {
            if (visitedNodeSet.size === nodes.length || edgeQueue.length === 0) {
                setAlgorithmStarted(false);
                setText("Prim's Algorithm Done!");
                setTimeout(resetEdges, 1000);
                return;
            }

            const edgesToHighlight = edgeQueue.slice(0, 1); 
            edgesToHighlight.forEach(edge => {
                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
            });

            stepIndex++;
                    if (isPausedRef.current) {
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if(isStepModeRef.current){
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }

                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }

            const edge = edgeQueue.shift();
            const { from, to } = edge;
            const fromInMST = visitedNodeSet.has(from.id);
            const toInMST = visitedNodeSet.has(to.id);

            if ((fromInMST && !toInMST) || (!fromInMST && toInMST)) {
                setVisitedEdges(prev => [
                    ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                    { ...edge, color: treeEdgeColor }
                ]);

                if (fromInMST && !toInMST) {
                    addEdges(to);
                } else if (!fromInMST && toInMST) {
                    addEdges(from);
                }
            } else {
                setVisitedEdges(prev => [
                    ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                    { ...edge, color: defaultEdgeColor }
                ]);
            }

            animateStep();
        };

        addEdges(startNode);
        animateStep();
    };

    // Function to animate Kruskall's algorithm
    const animateKruskalsAlgorithm = () => {
        if (algorithmRunning || isRemovingEdge) {
            return;
        }
        if(isDirected){
            toggleGraphType();
        }
        setRunningAlgorithm("Kruskall");
        setDisablePause(true);
        setAlgorithmRunning(true);
        setText("Kruskall's Algorithm in progress...");

        const sortedEdges = [...edges].sort((a, b) => calculateEdgeLength(a) - calculateEdgeLength(b));
        let componentIndex = 0;
        let currentComponentEdges = [];
        let currentComponentNodes = [];
        let uf;

        const visitedNodeSet = new Set();
        const foundComponents = [];

        const dfsComponent = (currentNode, component) => {
            if (visitedNodeSet.has(currentNode.id)) {
                return;
            }
            visitedNodeSet.add(currentNode.id);
            component.push(currentNode);
            adjList[currentNode.id].forEach(neighborId => {
                const neighborNode = nodes.find(node => node.id === neighborId);
                if (!visitedNodeSet.has(neighborId)) {
                    dfsComponent(neighborNode, component);
                }
            });
        };

        nodes.forEach(node => {
            if (!visitedNodeSet.has(node.id)) {
                const component = [];
                dfsComponent(node, component);
                foundComponents.push(component);
            }
        });

        setComponents(foundComponents);

        const animateComponentMST = (component) => {
            uf = new UnionFind(nodeCount); 
            currentComponentEdges = [];
            currentComponentNodes = component.map(node => node.id);
            let edgeIndex = 0;
            const color = componentColors[componentIndex % componentColors.length];

            const highlightNodesAndEdges = (index) => {
                if (index < currentComponentEdges.length) {
                    const { from, to } = currentComponentEdges[index];
                    setVisitedNodes(prev => [...prev, { id: from.id, color }, { id: to.id, color }]);
                    setVisitedEdges(prev => [...prev, currentComponentEdges[index]]);
                    setTimeout(() => highlightNodesAndEdges(index + 1), totalSliderCount - sliderValueRef.current); 
                } else {
                    componentIndex++;
                    if (componentIndex < foundComponents.length) {
                        setTimeout(() => animateComponentMST(foundComponents[componentIndex]), 0); 
                    } else {
                        setTimeout(resetEdges, 1000);
                        setText("Kruskall's Algorithm Done!");
                    }
                }
            };

            const animateStep = () => {
                if (currentComponentEdges.length === component.length - 1 || edgeIndex >= sortedEdges.length) {
                    highlightNodesAndEdges(0);
                    return;
                }

                const edge = sortedEdges[edgeIndex];
                edgeIndex++;

                if (currentComponentNodes.includes(edge.from.id) && currentComponentNodes.includes(edge.to.id) &&
                    uf.find(edge.from.id) !== uf.find(edge.to.id)) {
                    uf.union(edge.from.id, edge.to.id);
                    currentComponentEdges.push({ ...edge, color });
                }

                animateStep();
            };

            animateStep();
        };

        if (foundComponents.length > 0) {
            animateComponentMST(foundComponents[0]);
        } else {
            setAlgorithmRunning(false);
        }
    };

    // Function to start shortest path algorithm
    const startShortestPath = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("SP");

        setIsShortestPath(true);
        setAlgorithmRunning(true);
        setText("Select Start Node for Shortest Path");
    }

    // Function to find the shortest path between two nodes
    const findShortestPath = async (startNode, targetNode) => {
        setAlgorithmStarted(true);
        setText("Shortest Path Algorithm in progress...");
        const dist = {};
        const prev = {};
        const visitedEdgeSet = new Set();
        const visitedNodeSet = new Set();
        const priorityQueue = new Set(nodes.map(node => node.id)); 
        let stepIndex = 0;

        nodes.forEach(node => {
            dist[node.id] = Infinity;
            prev[node.id] = null;
        });
        dist[startNode.id] = 0;

        const getMinDistNode = () => {
            let minNode = null;
            priorityQueue.forEach(nodeId => {
                if (minNode === null || dist[nodeId] < dist[minNode]) {
                    minNode = nodeId;
                }
            });
            return minNode;
        };

        while (priorityQueue.size > 0) {
            const currentNodeId = getMinDistNode();
            const currentNode = nodes.find(node => node.id === currentNodeId);

            if (dist[currentNodeId] === Infinity) break;

            priorityQueue.delete(currentNodeId);

            if (currentNodeId === targetNode.id) {
                break;
            }

            for (let neighborId of adjList[currentNode.id]) {
                const edge = edges.find(e => 
                    (isDirected && e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (!isDirected && ((e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)))
                );

                if(!edge){
                    continue;
                }

                setCurrentNode(currentNode);
                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);

                if (!visitedEdgeSet.has(edge)) {
                    stepIndex++;
                    if (isPausedRef.current) {
                        // eslint-disable-next-line
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if(isStepModeRef.current){
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }

                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                    visitedEdgeSet.add(edge);
                }

                const alt = dist[currentNode.id] + calculateEdgeLength(edge);

                if (alt < dist[neighborId]) {
                    dist[neighborId] = alt;
                    prev[neighborId] = currentNode.id;

                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: treeEdgeColor }
                    ]);

                    visitedEdgeSet.add(edge);
                } else {
                    setVisitedEdges(prev => prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id && e.color === currentEdgeColor)));
                }
            }

            visitedNodeSet.add(currentNode.id);
            setVisitedNodes(prev => {
                const updatedNodes = [...prev, { id: currentNode.id, color: treeEdgeColor }];
                return updatedNodes;
            });
        }

        setStartNode(null);
        setEndNode(null);
        setAlgorithmStarted(false);
        setCurrentNode(null);
        setText("Shortest Path Done!");

        const path = [];

        let currentNodeId = targetNode.id;
        while (currentNodeId !== null) {
            path.unshift(currentNodeId);
            currentNodeId = prev[currentNodeId];
        }

        if(path.length === 1){
            setText("No path Found!");
            setTimeout(resetEdges, 1000);
            return;
        }

        setVisitedEdges(prev => {
            return prev.map(e => {
                if (path.includes(e.from.id) && path.includes(e.to.id)) {
                    return { ...e, color: treeEdgeColor };
                } else {
                    return { ...e, color: defaultEdgeColor };
                }
            });
        });

        setVisitedNodes(prev => {
            return nodes.map(node => {
                if (path.includes(node.id)) {
                    return { id: node.id, color: treeEdgeColor };
                } else {
                    return { id: node.id, color: "black" };
                }
            });
        });

        setTimeout(resetEdges, 1000);
    };

    // Function to start TSP
    const startTSP = async () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("TSP");
        setIsTSP(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin TSP");
    }

    // Function to animate TSP
    const tsp = async (node) => {
        setAlgorithmStarted(true);
        setText("TSP in progress...");
        const startNode = node;
        const unvisited = new Set(nodes.map(node => node.id));
        const visited = [];
        const stack = [];
        let currentNode = startNode;
        let stepIndex = 0;

        unvisited.delete(currentNode.id);
        visited.push(currentNode);
        setVisitedNodes([{ id: currentNode.id, color: treeEdgeColor }]);

        while (unvisited.size > 0) {
            let nearestNode = null;
            let shortestDistance = Infinity;
            let currentEdge = null;

            for (let neighborId of unvisited) {
                setCurrentNode(currentNode);
                const neighborNode = nodes.find(node => node.id === neighborId);
                // eslint-disable-next-line
                const edge = edges.find(e => 
                    (isDirected && e && e.from && e.to && e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (!isDirected && e && e.from && e.to && ((e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)))
                );

                if (!edge) {
                    continue;
                }
                
                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
                stepIndex++;
                if (isPausedRef.current) {
                    // eslint-disable-next-line
                    await new Promise(resolve => {
                        const checkStep = () => {
                            if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                resolve();
                            } else {
                                setTimeout(checkStep, 50);
                            }
                        };
                        checkStep();
                    });
                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                } else {
                    await sleep(totalSliderCount - sliderValueRef.current);
                }

                if(isStepModeRef.current){
                    setIsPaused(true);
                    isPausedRef.current = true;
                }
                const distance = calculateEdgeLength({ from: currentNode, to: neighborNode });
                setVisitedEdges(prev => prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)));
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestNode = neighborNode;
                    currentEdge = edge;
                }
                
            }

            if (nearestNode && currentEdge) {
                stack.push({ currentNode, nearestNode, shortestDistance });

                setVisitedEdges(prev => [...prev, { ...currentEdge, color: treeEdgeColor }]);
                setVisitedNodes(prev => [...prev, { id: nearestNode.id, color: treeEdgeColor }]);

                stepIndex++;
                    if (isPausedRef.current) {
                        // eslint-disable-next-line
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if(isStepModeRef.current){
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }

                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }

                currentNode = nearestNode;
                unvisited.delete(currentNode.id);
                visited.push(currentNode);
            } else {
                const previousState = stack.pop();
                if (previousState) {
                    currentNode = previousState.currentNode;
                } else {
                    break;
                }
            }
        }

        setCurrentNode(null);
        setAlgorithmStarted(false);
        setText("TSP Done!");
        setTimeout(resetEdges, 1000);
    };

    // Function to color graph
    const graphColoring = async () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("Color");
        setDisablePause(true);
        setAlgorithmRunning(true);
        setText("Graph Coloring in progress...");

        const availableColors = componentColors;
        const colors = {};

        const colorGraph = (node) => {
            const neighborColors = adjList[node.id].map(neighborId => colors[neighborId]);
            for(let color of availableColors){
                if(!neighborColors.includes(color)){
                    colors[node.id] = color;
                    break;
                }
            }
        }

        for(let node of nodes){
            colorGraph(node);
            setVisitedNodes(prev => [...prev, {id: node.id, color: colors[node.id]}]);
            await new Promise(resolve => setTimeout(resolve, totalSliderCount - sliderValueRef.current));
        }

        setText("Graph Coloring Done!");
        setTimeout(resetEdges, 1000);
    }

    // Function to find connected components in a graph
    const findConnectedComponents = async () => {
        setRunningAlgorithm("Connected");
        setAlgorithmStarted(true);
        setText("Connected Components in progress...");
        setAlgorithmRunning(true);
        const visitedNodeSet = new Set();
        const visitedEdgeSet = new Set();
        let componentIndex = 0;
        let stepIndex = 0;

        const dfsRecursive = async (currentNode, componentColor) => {
            if (visitedNodeSet.has(currentNode.id)) {
                return;
            }

            visitedNodeSet.add(currentNode.id);
            setVisitedNodes(prev => { 
                const updatedNodes = [...prev, { id: currentNode.id, color: componentColor }];
                return updatedNodes;
            });

            let iterations = 0;
            for (let neighborId of adjList[currentNode.id]) {
                iterations++;
                setCurrentNode(currentNode);     
                const neighborNode = nodes.find(node => node.id === neighborId); 
                const edge = edges.find(e =>                                     
                    (e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)
                );

                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);

                if (!visitedEdgeSet.has(edge)) {
                    stepIndex++;
                    if (isPausedRef.current) {
                        // eslint-disable-next-line
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if(isStepModeRef.current){
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }

                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                }

                if (!visitedNodeSet.has(neighborId)) { 
                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: componentColor }
                    ]);
                    visitedEdgeSet.add(edge);

                    await dfsRecursive(neighborNode, componentColor);
                } else {
                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: componentColor }
                    ]);
                }
            }

            if(iterations === 0){ //EXTRA SLEEP
                setCurrentNode(null);
                stepIndex++;
                if (isPausedRef.current) {
                    await new Promise(resolve => {
                        const checkStep = () => {
                            if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                resolve();
                            } else {
                                setTimeout(checkStep, 50);
                            }
                        };
                        checkStep();
                    });
                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                } else {
                    await sleep(totalSliderCount - sliderValueRef.current);
                }

                if(isStepModeRef.current){
                    setIsPaused(true);
                    isPausedRef.current = true;
                }
            }
        };

        for (let node of nodes) {
            if (!visitedNodeSet.has(node.id)) {
                const componentColor = componentColors[componentIndex % componentColors.length];
                componentIndex++;
                await dfsRecursive(node, componentColor);
            }
        }

        setCurrentNode(null);
        setAlgorithmStarted(false);
        setText("Connected Components Done!");
        setTimeout(resetEdges, 1000); 
    };

    // Function to find strong components
    const findStrongComponents = async () => {
        setRunningAlgorithm("Connected");
        setAlgorithmStarted(true);
        setText("Strong Components in progress...");
        setAlgorithmRunning(true);
    
        const stack = [];
        const visitedNodeSet = new Set();
        const visitedEdgeSet = new Set();
        const reverseAdjList = {};
        let stepIndex = 0;
    
        const reverseGraph = () => {
            nodes.forEach(node => {
                reverseAdjList[node.id] = [];
            });
            edges.forEach(edge => {
                reverseAdjList[edge.to.id].push(edge.from.id);
            });
        };
    
        const dfs1 = async (node) => {
            if (visitedNodeSet.has(node.id)) {
                return;
            }
    
            visitedNodeSet.add(node.id);
            
            for (let neighborId of reverseAdjList[node.id]) {
                if (!visitedNodeSet.has(neighborId)) {
                    const neighborNode = nodes.find(n => n.id === neighborId);
                    await dfs1(neighborNode);
                }
            }
            
            stack.push(node);
        };
    
        const dfs2 = async (node, componentColor) => {
            if (visitedNodeSet.has(node.id)) {
                return;
            }
            
            visitedNodeSet.add(node.id);
            setVisitedNodes(prev => { 
                const updatedNodes = [...prev, { id: node.id, color: componentColor }];
                return updatedNodes;
            });
        
            let iterations = 0;
            for (let neighborId of adjList[node.id]) {
                iterations++;
                setCurrentNode(node);
                const neighborNode = nodes.find(n => n.id === neighborId);
                const edge = edges.find(e => e.from.id === node.id && e.to.id === neighborId);
                
                if (!edge) {
                    continue;
                }
        
                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
        
                if (!visitedEdgeSet.has(edge)) {
                    stepIndex++;
                    if (isPausedRef.current) {
                        // eslint-disable-next-line
                        await new Promise(resolve => {
                            const checkStep = () => {
                                if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                    resolve();
                                } else {
                                    setTimeout(checkStep, 50);
                                }
                            };
                            checkStep();
                        });
                        if (isStepModeRef.current) {
                            setIsPaused(true);
                            isPausedRef.current = true;
                        }
                    } else {
                        await sleep(totalSliderCount - sliderValueRef.current);
                    }
        
                    if (isStepModeRef.current) {
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                }
                
                if (!visitedNodeSet.has(neighborId)) { 
                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: componentColor }
                    ]);
                    visitedEdgeSet.add(edge);
    
                    await dfs2(neighborNode, componentColor);
                } else {
                    setVisitedEdges(prev => [
                        ...prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)),
                        { ...edge, color: componentColor }
                    ]);
                }
            }
            if(iterations === 0){ //EXTRA SLEEP
                setCurrentNode(null);
                stepIndex++;
                if (isPausedRef.current) {
                    await new Promise(resolve => {
                        const checkStep = () => {
                            if (!isPausedRef.current || currentStepRef.current > stepIndex) {
                                resolve();
                            } else {
                                setTimeout(checkStep, 50);
                            }
                        };
                        checkStep();
                    });
                    if(isStepModeRef.current){
                        setIsPaused(true);
                        isPausedRef.current = true;
                    }
                } else {
                    await sleep(totalSliderCount - sliderValueRef.current);
                }

                if(isStepModeRef.current){
                    setIsPaused(true);
                    isPausedRef.current = true;
                }
            }
        };
    
        reverseGraph();
    
        for (let node of nodes) {
            if (!visitedNodeSet.has(node.id)) {
                await dfs1(node);
            }
        }
    
        visitedNodeSet.clear();
        visitedEdgeSet.clear();
    
        let componentIndex = 0;
        while (stack.length > 0) {
            const node = stack.pop();
            if (!visitedNodeSet.has(node.id)) {
                const componentColor = componentColors[componentIndex % componentColors.length];
                componentIndex++;
                await dfs2(node, componentColor);
            }
        }
    
        setCurrentNode(null);
        setAlgorithmStarted(false);
        setText("Strong Components Done!");
        setTimeout(resetEdges, 1000);
    };
    
    /*
        Graph (non-button) Function
    */

    // Function to add a new node to the graph
    const addNode = () => {
        if(algorithmRunning){
            return;
        }

        if(nodes.length >= 20){
            alert("too many nodes");
            return;
        }

        setText(startingText);
        const newNode = {
            id: nodeCount,
            x: Math.random() * 480,
            y: Math.random() * 480,
        };
        setNodes([...nodes, newNode]);
        setAdjList(prevAdjList => ({ ...prevAdjList, [newNode.id]: [] }));
        setNodeCount(nodeCount + 1);
    };

    const handleGenerateGraph =  (numNodes, numEdges, isDirected) => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        generateGraph(numNodes, numEdges, isDirected);
    }  

    // Function to generate a random graph
    const generateGraph = (numNodes, numEdges, isDirected) => {
        setIsDirected(isDirected);
        setNodes([]);
        setEdges([]);
        setAdjList({});
        setNodeCount(0);
        setVisitedNodes([]);
        setVisitedEdges([]);
        setSelectedNode(null);
        setText(startingText);

        const newNodes = [];
        const newEdges = [];
        const newAdjList = {};


        const gridSize = Math.ceil(Math.sqrt(numNodes));
        const areaWidth = 500; 
        const areaHeight = 500; 
        const margin = 10;
        const gridSpacingX = (areaWidth - 2 * margin) / gridSize;
        const gridSpacingY = (areaHeight - 2 * margin) / gridSize;

        for (let i = 0; i < numNodes; i++) {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = margin + col * gridSpacingX + Math.random() * gridSpacingX * 0.9;
            const y = margin + row * gridSpacingY + Math.random() * gridSpacingY * 0.9;

            const newNode = {
                id: i,
                x: x,
                y: y,
            };
            newNodes.push(newNode);
            newAdjList[i] = [];
        }

        while (newEdges.length < numEdges) {
            const from = newNodes[Math.floor(Math.random() * numNodes)];
            const to = newNodes[Math.floor(Math.random() * numNodes)];
            if (from.id !== to.id) {
                const edgeExists = newEdges.some(edge => 
                    (edge.from.id === from.id && edge.to.id === to.id) ||
                    (!isDirected && edge.from.id === to.id && edge.to.id === from.id)
                );
                if (!edgeExists) {
                    const newEdge = { from, to, color: defaultEdgeColor };
                    newEdges.push(newEdge);
                    newAdjList[from.id].push(to.id);
                    if(!isDirected){
                        newAdjList[to.id].push(from.id);
                    }
                }
            }
        }

        setNodes(newNodes);
        setEdges(newEdges);
        setAdjList(newAdjList);
        setNodeCount(newNodes.length);
    };

    // Function to reset the graph
    const resetGraph = () => {
        if(algorithmRunning){
            return;
        }
        setNodes([]);
        setEdges([]);
        setClickedMST(false);
        setClickedTraversal(false);
        setIsRemovingEdge(false);
        setText(startingText);
    };

    // Function to remove a selected node form the graph
    const removeNode = () => {
        if (selectedNode == null) return;

        setNodes(nodes.filter(node => node.id !== selectedNode.id));
        setEdges(edges.filter(edge => edge.from.id !== selectedNode.id && edge.to.id !== selectedNode.id));
        setAdjList(prevAdjList => {
            const newAdjList = { ...prevAdjList };
            delete newAdjList[selectedNode.id];
            for (const key in newAdjList) {
                newAdjList[key] = newAdjList[key].filter(id => id !== selectedNode.id);
            }
            return newAdjList;
        });
        setSelectedNode(null);
    };

    // Function to handle clicking on a node
    const handleNodeClick = (node) => {
        if (dragging) {
            return;
        }

        if (isAddingEdge) {
            if (selectedNode && selectedNode.id !== node.id) {
                const edgeExists = edges.some(edge =>
                    (edge.from.id === selectedNode.id && edge.to.id === node.id) ||
                    (!isDirected && edge.from.id === node.id && edge.to.id === selectedNode.id)
                );

                if(!edgeExists){
                    const newEdge = { from: selectedNode, to: node, color: defaultEdgeColor };
                    setEdges(prevEdges => [...prevEdges, newEdge]);

                    setAdjList(prevAdjList => {
                        const newAdjList = { ...prevAdjList };
                        if (!newAdjList[selectedNode.id]) newAdjList[selectedNode.id] = [];
                        if (!newAdjList[node.id]) newAdjList[node.id] = [];
                        newAdjList[selectedNode.id].push(node.id);
                        if (!isDirected) {
                            newAdjList[node.id].push(selectedNode.id);
                        }
                        return newAdjList;
                    })
                }
                
                setIsAddingEdge(false);
                setSelectedNode(null);
            } else if (selectedNode && selectedNode.id === node.id) {
                setSelectedNode(null);
                setIsAddingEdge(false);
            }
            setText(startingText);
        } else if(isDFS){
            setVisitedNodes([]);
            setVisitedEdges([]);
            dfs(node);
            setIsDFS(false);
        } else if(isBFS){
            setVisitedNodes([]);
            setVisitedEdges([]);
            bfs(node);
            setIsBFS(false);
        }else if(isPrim){
            setIsPrim(false);
            animatePrimsAlgorithm(node);
        }else if(isShortestPath){
            if(!startNode){
                setStartNode(node);
                setText("Select End Node for Shortest Path");
            }else if(!endNode){
                setEndNode(node);
                setText("Finding Shortest Path...");
                findShortestPath(startNode, node);
                setIsShortestPath(false);
            }
        }else if(isTSP){
            setVisitedNodes([]);
            setVisitedEdges([]);
            tsp(node);
            setIsTSP(false);
        }else{
            if (selectedNode && selectedNode.id === node.id) {
                setSelectedNode(null); 
                setText(startingText);
            } else {
                if(!algorithmRunning){
                    setSelectedNode(node);
                }
                
            }
        }
    }

    // Function to handle mouse down event for dragging
    const handleMouseDown = () => {
        setDragging(false);
    };

    // Function to handle slider change
    const handleSliderChange = (event) => {
        const newValue = event.target.value;
        setSliderValue(newValue);
        sliderValueRef.current = newValue;
    }

    // Function to start removing an edge
    const startRemovingEdge = () => {
        if(algorithmRunning){
            return;
        }

        if(isRemovingEdge){
            setIsRemovingEdge(false);
            setText("");
            return;
        }

        if(edges.length < 1){
            alert("must be at least one edge");
            return;
        }
        setText("Click on an edge to remove it");
        setIsRemovingEdge(true);
    }

    // Function to initiate adding an edge
    const handleAddEdge = () => {
        if (selectedNode === null) return;

        if(!isDirected){
            if(((nodes.length * (nodes.length - 1)) / 2) === edges.length){
                alert("cannot add another edge");
                return;
            }
        }else{
            if(((nodes.length * (nodes.length - 1))) === edges.length){
                alert("cannot add another edge");
                return;
            }
        }
        

        if (nodes.length < 2) {
            alert("You need at least two nodes to add an edge.");
            return;
        }
        setIsAddingEdge(true);
        setText("Click another node to add edge");
    };

    // Function to handle clicking on an edge
    const handleEdgeClick = (edge) => {
        if (isRemovingEdge) {
            setEdges(edges.filter(e => e !== edge));
            setIsRemovingEdge(false);

            setAdjList(prevAdjList => {
                const newAdjList = { ...prevAdjList };
                newAdjList[edge.from.id] = newAdjList[edge.from.id].filter(id => id !== edge.to.id);
                newAdjList[edge.to.id] = newAdjList[edge.to.id].filter(id => id !== edge.from.id);
                return newAdjList;
            });
            setText(startingText);
        }
    }

    // Function to handle dragging a node
    const handleDrag = (e, data, node) => {
        setDragging(true);
        node.x = data.x;
        node.y = data.y;
        setNodes([...nodes]);
    };

    // Function to handle stopping the drag of a node
    const handleDragStop = () => {
        setTimeout(() => {
            setDragging(false);
        }, 0);
    };

    // Function to sleep and check for pausing
    const sleep = (duration) => {
        return new Promise((resolve) => {
            const interval = 50;
            let elapsed = 0;

            const checkPauseAndSleep = () => {
                if (isPausedRef.current) {
                    const checkPause = () => {
                        if(isStepModeRef.current){
                            setIsStepMode(true);
                            resolve();
                        }else if (!isPausedRef.current){
                            resolve();
                        }else {
                            setTimeout(checkPause, interval);
                        }
                    };
                    checkPause();
                } else {
                    if (elapsed < duration) {
                        elapsed += interval;
                        setTimeout(checkPauseAndSleep, interval);
                    } else {
                        resolve();
                    }
                }
            };

            checkPauseAndSleep();
        });
    };

    // JSX for rendering the component
    return (
        <div className="main-container">
            <GraphModal 
                    show={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onGenerateGraph={handleGenerateGraph} 
                />
            <div className="button-container">
                <h3>Graph Creation</h3>

                {/* Graph Creation and Updating when node selected */}
                {selectedNode && (
                <button className="graph-button" onClick={handleAddEdge}>Add Edge</button>)}
                {selectedNode && (
                <button className="graph-button" onClick={removeNode}>Remove Node</button>)}

                {/* Graph Creation and Updating */}
                {!selectedNode && (
                <button className="graph-button" onClick={addNode}>Add Node</button>)}
                {!selectedNode && (
                <button className="graph-button" onClick={() => setIsModalOpen(true)}>Generate Graph</button>)}
                {!selectedNode && nodes.length > 0 && (
                <button className="graph-button" onClick={resetGraph}>Reset Graph</button>)}

                {/* Edge Editing */}
                {!selectedNode && edges.length > 0 && (
                    <h3>Edge Editing</h3>)}
               {!selectedNode && edges.length > 0 && (
                    <button className="graph-button" onClick={toggleGraphType}>
                        {isDirected ? 'Set Undirected' : 'Set Directed'}
                    </button>)}
                {!selectedNode && edges.length > 0 && (
                    <button className="graph-button" onClick={() => {if(edges.length>0){setShowWeights(!showWeights)}}}>
                        {showWeights ? 'Hide Weights' : 'Show Weights'}
                    </button>)}
                {!selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={startRemovingEdge}>Remove Edge</button>)}

                
                {algorithmStarted && !disablePause && (
                    <>
                        <h3>Control</h3>
                        <button className="graph-button" onClick={nextStep}>Next Step</button>
                        <button className="graph-button" onClick={togglePlayPause}>
                            {((isPaused || isStepMode) && !disablePause) ? "Play" : "Pause"}
                        </button>
                        <button className="graph-button" onClick={stopAlgorithm}>Stop</button>
                    </>
                )}

            </div>
                
            <div className="graph-content">
                
                <div className="slider-container">
                    <h4 className="slider-label">Algorithm Speed</h4>
                    <div className="slider-content">
                        <h4>Slow</h4>
                        <input 
                            type="range" 
                            min="100" 
                            max="2000" 
                            step="100" 
                            value={sliderValue} 
                            onChange={handleSliderChange}
                        />
                        <h4>Fast</h4>
                    </div>
                </div>
                <div className="graph-box">
                    
                <svg className="edges-svg" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                    {edges.map((edge, index) => {
                        const midpoint = calculateMidpoint(edge);
                        const { angle, flipped } = calculateAngle(edge);
                        const arrowLength = 15;
                        const arrowAngle = 30;
                        const nodeRadius = 10;
                
                        
                        const dx = edge.to.x - edge.from.x;
                        const dy = edge.to.y - edge.from.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const unitDx = dx / length;
                        const unitDy = dy / length;
                        
                        const baseX = edge.to.x - nodeRadius * unitDx;
                        const baseY = edge.to.y - nodeRadius * unitDy;
                        
                        const edgeCount = edges.filter(e => 
                            (e.from.id === edge.from.id && e.to.id === edge.to.id) || 
                            (e.from.id === edge.to.id && e.to.id === edge.from.id)
                        ).length;

                        let offsetX = 0;
                        let offsetY = 0;

                        if (edgeCount > 1) {
                            offsetX = 5 * unitDy; 
                            offsetY = -5 * unitDx;
                        }

                        const adjustedFromX = edge.from.x + 10 + offsetX;
                        const adjustedFromY = edge.from.y + 10 + offsetY;
                        const adjustedToX = baseX + 10 + offsetX ;
                        const adjustedToY = baseY + 10 + offsetY;

                        const arrowBaseX = baseX + offsetX + 10;
                        const arrowBaseY = baseY + offsetY + 10;
                
                        let arrowX1, arrowY1, arrowX2, arrowY2;
                        if (flipped) {
                            arrowX1 = arrowBaseX + arrowLength * Math.cos((angle + arrowAngle) * Math.PI / 180);
                            arrowY1 = arrowBaseY + arrowLength * Math.sin((angle + arrowAngle) * Math.PI / 180);
                            arrowX2 = arrowBaseX + arrowLength * Math.cos((angle - arrowAngle) * Math.PI / 180);
                            arrowY2 = arrowBaseY + arrowLength * Math.sin((angle - arrowAngle) * Math.PI / 180);
                        } else {
                            arrowX1 = arrowBaseX - arrowLength * Math.cos((angle - arrowAngle) * Math.PI / 180);
                            arrowY1 = arrowBaseY - arrowLength * Math.sin((angle - arrowAngle) * Math.PI / 180);
                            arrowX2 = arrowBaseX - arrowLength * Math.cos((angle + arrowAngle) * Math.PI / 180);
                            arrowY2 = arrowBaseY - arrowLength * Math.sin((angle + arrowAngle) * Math.PI / 180);
                        }


                        return (
                            <React.Fragment key={index}>
                                <line
                                    x1={adjustedFromX}
                                    y1={adjustedFromY}
                                    x2={adjustedToX}
                                    y2={adjustedToY}
                                    stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                    strokeWidth={isRemovingEdge ? 8 : 4}
                                    onClick={() => handleEdgeClick(edge)}
                                />
                                {isDirected && (
                                   <>
                                        <line
                                            x1={adjustedToX}
                                            y1={adjustedToY}
                                            x2={arrowX1}
                                            y2={arrowY1}
                                            stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                            strokeWidth={isRemovingEdge ? 8 : 4}
                                        />
                                        <line
                                           x1={adjustedToX}
                                           y1={adjustedToY}
                                           x2={arrowX2}
                                           y2={arrowY2}
                                            stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                            strokeWidth={isRemovingEdge ? 8 : 4}
                                        />
                                    </>
                                )}
                                {showWeights && (
                                    <text
                                        x={midpoint.x + 10}
                                        y={edgeCount > 1 ? midpoint.y + 2 : midpoint.y + 7}
                                        fill="black"
                                        fontSize="12"
                                        transform={`rotate(${angle}, ${midpoint.x + 10}, ${midpoint.y + 10})`}
                                        textAnchor="middle"
                                    >
                                        {Math.round(calculateEdgeLength(edge))}
                                    </text>)}
                            </React.Fragment>
                        );
                    })}
                </svg>
                    {nodes.map(node => (
                        <Draggable
                            key={node.id}
                            position={{ x: node.x, y: node.y }}
                            bounds="parent"
                            onStart={handleMouseDown}
                            onDrag={(e, data) => handleDrag(e, data, node)}
                            onStop={handleDragStop}
                        >
                            <div
                                className="graph-node"
                                onClick={() => handleNodeClick(node)}
                                style={{
                                    border: (isTSP || isBFS || isPrim || isDFS || isShortestPath) ? (startNode && startNode.id === node.id ? 'none' : '2px solid red') : (selectedNode && selectedNode.id === node.id ? '2px solid red' : 'none'),
                                    backgroundColor: 
                                    node.id === currentNode?.id ? 'red' : 
                                    visitedNodes.some(vn => vn.id === node.id) ? 
                                        (visitedNodes.find(vn => vn.id === node.id)?.color || componentColors[components.findIndex(comp => comp.some(n => n.id === node.id)) % componentColors.length] || "blue") 
                                        : 'black',
                                    pointerEvents: 'auto',
                                    position: 'absolute'
                                }}
                            >
                            </div>
                        </Draggable>
                    ))}
                </div>
                <h3 class-name="status-text">{text}</h3>
            </div>

            <div className="button-container">    
                {/* Traversal and MST and Path*/}
                {edges.length > 0 && !selectedNode &&(
                <h3>Algorithms</h3>)}
                {edges.length > 0 && !selectedNode && !clickedTraversal && !clickedMST && !clickedPaths && (
                <button className="graph-button" onClick={setClickTraversal}>Traversals →</button>)}
                {edges.length > 0 && !selectedNode && !clickedTraversal && !clickedMST && !clickedPaths && (
                <button className="graph-button" onClick={setClickMST}>MSTs →</button>)}
                {edges.length > 0 && !selectedNode && !clickedTraversal && !clickedMST && !clickedPaths && (
                <button className="graph-button" onClick={setClickPath}>Paths →</button>)}


                {/* Specific Algorithms */}
                {clickedMST && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Kruskall" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Kruskall" ? highlightedButtonColor : "" }}className="graph-button" onClick={animateKruskalsAlgorithm}>Kruskall</button>)}
                {clickedMST && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Prim" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Prim" ? highlightedButtonColor : "" }}className="graph-button" onClick={startPrim}>Prim</button>)}

                {clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "DFS" ? highlightedButtonColor : "", backgroundColor: runningAlgorithm === "DFS" ? highlightedButtonColor : "" }}className="graph-button" onClick={startDFS}>DFS</button>)}
                {clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "BFS" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "BFS" ? highlightedButtonColor : "" }}className="graph-button" onClick={startBFS}>BFS</button>)}

                {clickedPaths && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "SP" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "SP" ? highlightedButtonColor : "" }}className="graph-button" onClick={startShortestPath}>Shortest Path</button>)}
                {clickedPaths && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "TSP" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "TSP" ? highlightedButtonColor : "" }}className="graph-button" onClick={startTSP}>TSP</button>)}
                
                {!clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Color" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Color" ? highlightedButtonColor : "" }}className="graph-button" onClick={graphColoring}>Graph Coloring</button>)}
                {!isDirected && !clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Connected" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Connected" ? highlightedButtonColor : "" }}className="graph-button" onClick={findConnectedComponents}>Connected Components</button>)}
                {isDirected && !clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button style={{border:runningAlgorithm === "Connected" ? highlightedButtonColor : "",  backgroundColor: runningAlgorithm === "Connected" ? highlightedButtonColor : "" }}className="graph-button" onClick={findStrongComponents}>Strong Components</button>)}

                {/* Back Button */}
                {(clickedTraversal || clickedMST || clickedPaths) && !selectedNode && (
                <button className="graph-button" onClick={goBack}>← Back</button>)} 
                
            </div>
        </div>
    );
    
}

export default Graphs;