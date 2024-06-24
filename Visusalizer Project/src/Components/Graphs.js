import React, {useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

const Graphs = () => {
    // State variables to manage graph nodes, edges, and various UI states
    const [text, setText] = useState("Add Node or Generate Graph to Begin");
    const [nodes, setNodes] = useState([]);
    const [nodeCount, setNodeCount] = useState(0);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isAddingEdge, setIsAddingEdge] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [isRemovingEdge, setIsRemovingEdge] = useState(false);
    // eslint-disable-next-line
    const [visitedNodes, setVisitedNodes] = useState([]);
    const [visitedEdges, setVisitedEdges] = useState([]);
    const [adjList, setAdjList] = useState([]);
    const [clickedTraversal, setClickedTraveral] = useState(false);
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
    const [componentColors] = useState(["blue", "green", "orange", "purple", "pink", "yellow", "gold", "coral", "crimson", "cyan", "darkgreen", "drakblue", "darkorange", "darkorchid", "darkred", "deeppink", "darkviolet", "deepskyblue", "forestgreen", "fuchsia"]);
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

    // Constants for UI text and colors
    const startingText = "Move Node, Select Node, or Press Button to Continue";
    const treeEdgeColor = "blue"; 
    const currentEdgeColor = "red"; 
    const defaultEdgeColor = "grey";

    // Use Effect to differentiate between modes
    useEffect(() => {
        isStepModeRef.current = isStepMode;
    }, [isStepMode]);

    // Use Effect to allow pausing mid-alg
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
    };

    // Function to calculate edge length
    const calculateEdgeLength = (edge) => {
        const dx = edge.from.x - edge.to.x;
        const dy = edge.from.y - edge.to.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    // Function to calculate midpoiint of an edge
    const calculateMidpoint = (edge) => {
        const midX = (edge.from.x + edge.to.x) / 2;
        const midY = (edge.from.y + edge.to.y) / 2;
        return { x: midX, y: midY };
    };
    
    // Fucntion to calculate angle of an edge
    const calculateAngle = (edge) => {
        const dx = edge.to.x - edge.from.x;
        const dy = edge.to.y - edge.from.y;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
        if (dx >= 0 && dy < 0) {
            // First quadrant: leave angle as is
        } else if (dx < 0 && dy < 0) {
            // Second quadrant: negate angle
            angle += 180;
        } else if (dx < 0 && dy >= 0) {
            // Third quadrant: negate angle
            angle -= 180;
        } else if (dx >= 0 && dy >= 0) {
            // Fourth quadrant: leave angle as is
        }
    
        return angle;
    };

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

    // Function to generate a random graph
    const generateGraph = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }

        var numNodes = 0;
        var numEdges = -1;

        do{
            const response = prompt("Enter the number of nodes:", "");

            if(isNaN(response)){
                alert("Invalid input. Please enter numbers only");
                continue;
            }

            if(response <= 0 || response > 20){
                alert("Invalid input. Number of nodes must be between 1 and 20");
                continue;
            }

            numNodes = response;

        }while(numNodes === 0);

        do{
            const response = prompt("Enter the number of edges:", "");

            if(isNaN(response)){
                alert("Invalid input. Please enter numbers only");
                continue;
            }

            if(response > ((numNodes * (numNodes - 1)) / 2)){
                alert("Invalid input. Too many edges for the graph");
                continue;
            }

            if(response < 0){
                alert("Invalid input. Not enough edges");
                continue;
            }

            numEdges = response;

        }while(numEdges === -1);

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
                    (edge.from.id === to.id && edge.to.id === from.id)
                );
                if (!edgeExists) {
                    const newEdge = { from, to, color: defaultEdgeColor };
                    newEdges.push(newEdge);
                    newAdjList[from.id].push(to.id);
                    newAdjList[to.id].push(from.id);
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
        setClickedTraveral(false);
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
                    (edge.from.id === node.id && edge.to.id === selectedNode.id)
                );

                if(!edgeExists){
                    const newEdge = { from: selectedNode, to: node, color: defaultEdgeColor };
                    setEdges(prevEdges => [...prevEdges, newEdge]);

                    setAdjList(prevAdjList => {
                        const newAdjList = { ...prevAdjList };
                        if (!newAdjList[selectedNode.id]) newAdjList[selectedNode.id] = [];
                        if (!newAdjList[node.id]) newAdjList[node.id] = [];
                        newAdjList[selectedNode.id].push(node.id);
                        newAdjList[node.id].push(selectedNode.id);
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

        if(((nodes.length * (nodes.length - 1)) / 2) === edges.length){
            alert("cannot add another edge");
            return;
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
    
    // Function to start DFS
    const startDFS = () => {
        if(algorithmRunning|| isRemovingEdge){
            return;
        }
        setIsDFS(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin DFS");
    }

    // DFS implementatoin
    const dfs = async (startNode) => {
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
                    (e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)
                );

                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
               
                if (!visitedEdgeSet.has(edge)) {
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
        setText("DFS Done!");
        setTimeout(resetEdges, 1000); 
    };

    // Function to start BFS
    const startBFS = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setIsBFS(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin BFS");
    }

    // BFS implementation
    const bfs = async (startNode) => {
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
                    (e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)
                );
    
                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);

                if(!visitedEdgeSet.has(edge)){
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
        setText("BFS Done!");
        setTimeout(resetEdges, 1000); 
    };
    
    // Function to animate Kruskall's algorithm
    const animateKruskalsAlgorithm = () => {
        if (algorithmRunning || isRemovingEdge) {
            return;
        }
        setDisablePause(true);
        setAlgorithmRunning(true);
        setText("Running Kruskal's Algorithm...");
    
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
                        setText("Kruskal's Algorithm completed!");
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
            console.log("No components found.");
            setAlgorithmRunning(false);
        }
    };

     // Union-Find data structure for Kruskal's algorithm
    class UnionFind {
        constructor(size) {
            this.parent = Array(size).fill(null).map((_, index) => index);
            this.rank = Array(size).fill(0);
        }

        find(node) {
            if (this.parent[node] !== node) {
                this.parent[node] = this.find(this.parent[node]);
            }
            return this.parent[node];
        }

        union(node1, node2) {
            const root1 = this.find(node1);
            const root2 = this.find(node2);

            if (root1 !== root2) {
                if (this.rank[root1] > this.rank[root2]) {
                    this.parent[root2] = root1;
                } else if (this.rank[root1] < this.rank[root2]) {
                    this.parent[root1] = root2;
                } else {
                    this.parent[root2] = root1;
                    this.rank[root1] += 1;
                }
            }
        }
    }

    // Function to start Prim's algorithm
    const startPrim = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setIsPrim(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin Prim's Algorithm");
    }

    // Function to animate Prim's algorithm
    const animatePrimsAlgorithm = async (startNode) => {
        setText("Running Prim's Algorithm...");
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
                setText("Prim's Algorithm completed!");
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
    
    // Function to set traversal mode
    const setClickTraversal = () => {
        if(algorithmRunning){
            return;
        }

        setClickedTraveral(true);
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
        setClickedTraveral(false);
        setClickedPaths(false);
        setAlgorithmRunning(false);
        setText(startingText);
    }

    // Function to find connected components in a graph
    const findConnectedComponents = async () => {
        setText("Finding connected components...");
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
    
            for (let neighborId of adjList[currentNode.id]) {
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
        };
    
        for (let node of nodes) {
            if (!visitedNodeSet.has(node.id)) {
                const componentColor = componentColors[componentIndex % componentColors.length];
                componentIndex++;
                await dfsRecursive(node, componentColor);
            }
        }
    
        setCurrentNode(null);
        setText("Connected Components Found!");
        setTimeout(resetEdges, 1000); 
    };
    
    // Function to start shortest path algorithm
    const startShortestPath = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }

        setIsShortestPath(true);
        setAlgorithmRunning(true);
        setText("Select Start Node for Shortest Path");
    }

    // Function to find the shortest path between two nodes
    const findShortestPath = async (startNode, targetNode) => {
        setText("Dijkstra's Algorithm in progress...");
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
                const neighborNode = nodes.find(node => node.id === neighborId);
                const edge = edges.find(e => 
                    (e.from.id === currentNode.id && e.to.id === neighborId) ||
                    (e.from.id === neighborId && e.to.id === currentNode.id)
                );
    
                setCurrentNode(currentNode);
                setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
    
                if (!visitedEdgeSet.has(edge)) {
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
        setCurrentNode(null);
        setText("Shortest Path Found!");
    
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
    
    // Function to handle slider change
    const handleSliderChange = (event) => {
        const newValue = event.target.value;
        setSliderValue(newValue);
        sliderValueRef.current = newValue;
    }

    // Function to color graph
    const graphColoring = async () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        
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

    // Function to start TSP
    const startTSP = async () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }

        setIsTSP(true);
        setAlgorithmRunning(true);
        setText("Select Node to begin TSP");
    }

    // Function to animate TSP
    const tsp = async (node) => {
        setText("Solving TSP using nearest neighbor...");
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
                    (e.from.id === currentNode.id && e.to.id === neighborNode.id) ||
                    (e.from.id === neighborNode.id && e.to.id === currentNode.id)
                );
    
                if (edge) {
                    setVisitedEdges(prev => [...prev, { ...edge, color: currentEdgeColor }]);
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
                    const distance = calculateEdgeLength({ from: currentNode, to: neighborNode });
                    setVisitedEdges(prev => prev.filter(e => !(e.from.id === edge.from.id && e.to.id === edge.to.id)));
                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestNode = neighborNode;
                        currentEdge = edge;
                    }
                }
            }
    
            if (nearestNode && currentEdge) {
                stack.push({ currentNode, nearestNode, shortestDistance });
    
                setVisitedEdges(prev => [...prev, { ...currentEdge, color: treeEdgeColor }]);
                setVisitedNodes(prev => [...prev, { id: nearestNode.id, color: treeEdgeColor }]);
    
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
        setText("TSP Solved!");
        setTimeout(resetEdges, 1000);
    };

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
        } else {
            setIsStepMode(false);
            setIsPaused(true);
            isPausedRef.current = true;
        }
    };

    // Function to sleep 
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // JSX for rendering the component
    return (
        <div className="main-container">
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
                <button className="graph-button" onClick={generateGraph}>Generate Graph</button>)}
                {!selectedNode && nodes.length > 0 && (
                <button className="graph-button" onClick={resetGraph}>Reset Graph</button>)}

                {!selectedNode && edges.length > 0 && (
                    <h3>Edge Editing</h3>)}
                {!selectedNode && edges.length > 0 && (
                    <button className="graph-button" onClick={() => {if(edges.length>0){setShowWeights(!showWeights)}}}>
                        {showWeights ? 'Hide Weights' : 'Show Weights'}
                    </button>)}
                {!selectedNode && (edges.length >= 1) && (
                <button className="graph-button" onClick={startRemovingEdge}>Remove Edge</button>)}

                
                {algorithmRunning && !disablePause && (
                        <>
                            <h3>Control</h3>
                            <button className="graph-button" onClick={nextStep}>Next Step</button>
                            <button className="graph-button" onClick={togglePlayPause}>
                                {((isPaused || isStepMode) && !disablePause) ? "Play" : "Pause"}
                            </button>
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
                        const angle = calculateAngle(edge);
                        return (
                            <React.Fragment key={index}>
                                <line
                                    x1={edge.from.x + 10}
                                    y1={edge.from.y + 10}
                                    x2={edge.to.x + 10}
                                    y2={edge.to.y + 10}
                                    stroke={visitedEdges.find(e => e.from.id === edge.from.id && e.to.id === edge.to.id)?.color || (isRemovingEdge ? "red" : "grey")}
                                    strokeWidth={isRemovingEdge ? 8 : 4}
                                    onClick={() => handleEdgeClick(edge)}
                                />
                                {showWeights && (
                                    <text
                                        x={midpoint.x + 10}
                                        y={midpoint.y + 7}
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
                <button className="graph-button" onClick={animateKruskalsAlgorithm}>Kruskall</button>)}
                {clickedMST && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={startPrim}>Prim</button>)}

                {clickedTraversal && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={startDFS}>DFS</button>)}
                {clickedTraversal && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={startBFS}>BFS</button>)}

                {clickedPaths && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={startShortestPath}>Shortest Path</button>)}
                {clickedPaths && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={startTSP}>TSP</button>)}
                
                {!clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={findConnectedComponents}>Connected Components</button>)}
                {!clickedPaths && !clickedMST && !clickedTraversal && !selectedNode && edges.length > 0 && (
                <button className="graph-button" onClick={graphColoring}>Graph Coloring</button>)}
                
                

                {/* Back Button */}
                {(clickedTraversal || clickedMST || clickedPaths) && !selectedNode && (
                <button className="graph-button" onClick={goBack}>← Back</button>)} 
                
            </div>
        </div>
    );
};

export default Graphs;