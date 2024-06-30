import { useGraph } from './GraphContext';
import UnionFind from "./UnionFind";
import { calculateEdgeLength } from './GraphUtilities';

export const useGraphAlgorithms = () => {

    const {
        algorithmRunning,
        isRemovingEdge,
        isDirected,
        setRunningAlgorithm,
        setDisablePause,
        setAlgorithmRunning,
        setText,
        edges,
        nodes,
        setComponents,
        nodeCount,
        componentColors,
        totalSliderCount,
        sliderValueRef,
        setVisitedNodes,
        setVisitedEdges,
        adjList,
        startingText,
        setCurrentStep,
        currentStepRef,
        setAlgorithmStarted,
        isPausedRef,
        treeEdgeColor,
        setCurrentNode,
        currentEdgeColor,
        isStepModeRef,
        setIsPaused,
        setIsStepMode,
        defaultEdgeColor,
        setStartNode,
        setEndNode
    } = useGraph();

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

    // Function to help with play / pause during sleep
    const helper = async (stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef) => {
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

    // Function to reset a graph after an algorithm runs
    const resetEdges = () => {
        setVisitedEdges([]);
        setVisitedNodes([]);
        setText(startingText);
        setAlgorithmRunning(false);
        setCurrentStep(0);
        currentStepRef.current = 0;
        setDisablePause(false);
        setRunningAlgorithm(null);
    };

    // DFS implementatoin
    const dfs = async (startNode) => {
        setAlgorithmStarted(true);
        setText("DFS in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }

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

                setVisitedEdges(prev => {
                    const updatedEdges = [...prev, { ...edge, color: currentEdgeColor }];
                    return updatedEdges;
                });
            
                if (!visitedEdgeSet.has(edge)) {
                    stepIndex++;
                    await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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

    // BFS implementation
    const bfs = async (startNode) => {
        setAlgorithmStarted(true);
        setText("BFS in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }
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
                    await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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

    // Function to run Kruskal's algorithm
    const animateKruskalsAlgorithm = () => {
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

    // Function to animate Prim's algorithm
    const animatePrimsAlgorithm = async (startNode) => {
        setAlgorithmStarted(true);
        setText("Prim's Algorithm in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }
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
            await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);

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

    // Function to find the shortest path between two nodes
    const findShortestPath = async (startNode, targetNode) => {
        setAlgorithmStarted(true);
        setText("Shortest Path Algorithm in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }
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
                    await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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

    // Function to animate TSP
    const tsp = async (node) => {
        setAlgorithmStarted(true);
        setText("TSP in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }
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
                await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);

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
                await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);

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
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("Connected");
        setAlgorithmStarted(true);
        setText("Connected Components in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }
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
                    await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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
                await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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
        if(algorithmRunning || isRemovingEdge){
            return;
        }
        setRunningAlgorithm("Connected");
        setAlgorithmStarted(true);
        setText("Strong Components in progress...");
        if(isPausedRef.current){
            setText("Algorithm is Paused");
        }
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
                    await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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
                await helper(stepIndex, isPausedRef, currentStepRef, isStepModeRef, setIsPaused, totalSliderCount, sliderValueRef);
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

    return {
        animateKruskalsAlgorithm,
        dfs,
        bfs,
        animatePrimsAlgorithm,
        findShortestPath,
        tsp,
        graphColoring,
        findConnectedComponents,
        findStrongComponents
    };
};
