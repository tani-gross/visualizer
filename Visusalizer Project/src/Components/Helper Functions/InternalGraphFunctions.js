import { useGraphAlgorithms } from './GraphAlgorithms';
import { useGraph } from './GraphContext';

export const useInternalGraphFunctions = () => {
    const {dfs, bfs, animatePrimsAlgorithm, tsp, findShortestPath} = useGraphAlgorithms();

    const {
        algorithmRunning,
        isRemovingEdge,
        isDirected,
        setText,
        edges,
        nodes,
        nodeCount,
        sliderValueRef,
        setVisitedNodes,
        setVisitedEdges,
        startingText,
        defaultEdgeColor,
        setStartNode,
        setEndNode,
        setNodes,
        setAdjList,
        setNodeCount,
        setIsDirected,
        setEdges,
        setSelectedNode,
        setClickedMST,
        setClickedTraversal,
        selectedNode,
        dragging,
        isAddingEdge,
        setIsRemovingEdge,
        setIsAddingEdge,
        isDFS,
        setIsBFS,
        isBFS,
        isPrim,
        setIsPrim,
        startNode,
        setIsTSP,
        setIsDFS,
        isShortestPath,
        endNode,
        setIsShortestPath,
        isTSP,
        setDragging,
        setSliderValue,
        setIsModalOpen,
        setModalMessage,
        setIsAlerting,
        setAvailableNodes,
        setCurrentNode
    } = useGraph();

    // Function to add a new node to the graph
    const addNode = () => {
        if(algorithmRunning){
            return;
        }

        if(nodes.length >= 20){
            showAlert("Cannot add any more nodes");
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

    // Fucntion to handle generating the graph
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
                
            }
            setCurrentNode(null);
            setText(startingText);
            setSelectedNode(null);
            setIsAddingEdge(false);
            setAvailableNodes([]);
            
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
            showAlert("There must be at least one edge");
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
                showAlert("No room to add another edge");
                return;
            }
        }else{
            if(((nodes.length * (nodes.length - 1))) === edges.length){
                showAlert("No room to add another edge");
                return;
            }
        }
        

        if (nodes.length < 2) {
            showAlert("You need at least two nodes to add an edge.");
            return;
        }

        

        const availableNodes = nodes.filter(node => 
            !edges.some(edge => 
                (edge.from.id === selectedNode.id && edge.to.id === node.id) ||
                (!isDirected && edge.from.id === node.id && edge.to.id === selectedNode.id)
            ) && node.id !== selectedNode.id
        ).map(node => node.id);

        if(availableNodes.length === 0){
            return;
        }

        setIsAddingEdge(true);
        setText("Click another node to add edge");
        setCurrentNode(selectedNode);
        setAvailableNodes(availableNodes);
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

    // Fucntion to handle opening the generate graph nodal
    const handleOpeningModal = () => {
        if(algorithmRunning || isRemovingEdge){
            return;
        }else{
            setIsModalOpen(true);
        }

    }

    // Function to show the alert moal
    const showAlert = (message) => {
        setModalMessage(message);
        setIsAlerting(true);
    }

    return {
        addNode,
        handleGenerateGraph,
        generateGraph,
        resetGraph,
        removeNode,
        handleNodeClick,
        handleMouseDown,
        handleSliderChange,
        startRemovingEdge,
        handleAddEdge,
        handleEdgeClick,
        handleDrag,
        handleDragStop,
        handleOpeningModal,
        showAlert
    };
};