import { DocumentItem } from '../types';

export const SAMPLE_DOCUMENTS: DocumentItem[] = [
  {
    id: 'sample-os-notes',
    name: 'Operating_System_Notes.pdf',
    size: '12.4 MB',
    pageCount: 16,
    uploadDate: 'Sep 25, 2026',
    isSample: true,
    fullText: `OPERATING SYSTEMS & SYSTEM ARCHITECTURE
Module 1: Introduction to Operating Systems and Architecture
An Operating System (OS) is a foundational system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between the computer user and computer hardware.

Key Goals of an Operating System:
1. Convenience: Make the computer system friendly and easy to use.
2. Efficiency: Allow computer hardware resources to be utilized in an optimal manner.
3. Reliability & Security: Prevent interference between concurrent user tasks and safeguard against system crashes.

Module 2: Process Management & Scheduling
A Process is defined as a program in execution. While a program is a passive entity stored on secondary storage (like an executable file on disk), a process is an active entity with a program counter specifying the next instruction to execute and a set of associated resources.

Components of a Process:
- Text Section: The executable program code.
- Data Section: Global and static variables.
- Heap: Memory dynamically allocated during process runtime.
- Stack: Temporary data such as function parameters, return addresses, and local variables.

Process Control Block (PCB):
Each process is represented in the operating system by a Process Control Block (also called task control block).
The PCB contains vital information including:
1. Process State: New, Ready, Running, Waiting, or Terminated.
2. Program Counter: Indicates the address of the next instruction to execute.
3. CPU Registers: Accumulators, index registers, stack pointers, and general-purpose registers.
4. CPU-Scheduling Information: Process priority, scheduling queue pointers.
5. Memory-Management Information: Value of base and limit registers, page tables, or segment tables.
6. Accounting Information: CPU time consumed, time limits, account numbers.
7. I/O Status Information: List of I/O devices allocated to the process, list of open files.

Context Switching:
Switching the CPU to another process requires performing a state save of the current process and a state restore of a different process. This task is known as a Context Switch.
When a context switch occurs, the kernel saves the context of the old process in its PCB and loads the saved context of the new process scheduled to run. Context switch time is pure overhead because the system does no useful work while switching. Its speed varies from machine to machine, depending on memory speed, the number of registers, and the existence of special instructions.

Process States:
- New: The process is being created.
- Ready: The process is waiting to be assigned to a processor.
- Running: Instructions are being executed.
- Waiting (Blocked): The process is waiting for some event to occur (such as I/O completion or reception of a signal).
- Terminated: The process has finished execution.

CPU Scheduling Criteria:
- CPU Utilization: Keep the CPU as busy as possible (ranging from 40% to 90%).
- Throughput: Number of processes completed per unit time.
- Turnaround Time: Interval from the time of submission of a process to the time of completion.
- Waiting Time: Total amount of time a process spends waiting in the ready queue.
- Response Time: Time from submission of a request until the first response is produced.

Scheduling Algorithms:
1. First-Come, First-Served (FCFS): Non-preemptive, suffers from Convoy Effect.
2. Shortest-Job-First (SJF): Provably optimal in minimizing average waiting time, but difficult to predict CPU burst lengths.
3. Round Robin (RR): Preemptive scheduling designed especially for time-sharing systems. A small unit of time, called a time quantum (or time slice), is defined (typically 10 to 100 milliseconds).
4. Priority Scheduling: Equal-priority processes scheduled in FCFS order. Major issue is Starvation (Indefinite Blocking), solved by Aging.

Module 3: Memory Management & Virtual Memory
Memory management is the functionality of an operating system that handles or oversees primary memory and moves processes back and forth between main memory and disk during execution.

Paging:
Paging is a memory management scheme that eliminates the need for contiguous allocation of physical memory. Physical memory is divided into fixed-sized blocks called Frames, and logical memory is divided into blocks of the same size called Pages.
Address Translation:
Logical address consists of two parts: Page Number (p) and Page Offset (d). The Page Table maps the page number to the corresponding physical frame number.

Virtual Memory & Page Faults:
Virtual memory allows the execution of processes that are not completely in main memory. A page fault occurs when a program attempts to access data or code in its address space, but the page is currently not resident in physical RAM.
Page Replacement Algorithms include FIFO, Optimal (Belady's Anomaly), and Least Recently Used (LRU).

Module 4: Storage & File System Management
File management organizes and manages files stored on secondary storage. File directory structures (single-level, two-level, hierarchical tree) organize files. Allocation methods include Contiguous Allocation, Linked Allocation, and Indexed Allocation (used in Unix i-nodes).`,
    pages: [
      {
        pageNumber: 1,
        text: `OPERATING SYSTEMS & SYSTEM ARCHITECTURE\nModule 1: Introduction to Operating Systems and Architecture\nAn Operating System (OS) is a foundational system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between the computer user and computer hardware.\n\nKey Goals: Convenience, Efficiency, Reliability & Security.`,
      },
      {
        pageNumber: 2,
        text: `Module 2: Process Management\nA Process is defined as a program in execution. While a program is a passive entity stored on secondary storage, a process is an active entity with a program counter and associated resources.\n\nComponents of a Process:\n- Text Section (code)\n- Data Section (global variables)\n- Heap (dynamic memory)\n- Stack (local variables, function calls).`,
      },
      {
        pageNumber: 3,
        text: `Process Control Block (PCB):\nEach process is represented in the OS by a Process Control Block (PCB).\nContains: Process State, Program Counter, CPU Registers, CPU-scheduling information, Memory management info, Accounting & I/O status.\n\nContext Switching:\nSwitching the CPU to another process requires performing a state save of the current process and a state restore of a different process. It is pure overhead.`,
      },
      {
        pageNumber: 4,
        text: `Process States & CPU Scheduling:\nProcess States: New -> Ready -> Running -> Waiting -> Terminated.\nScheduling Algorithms:\n- FCFS (Convoy Effect)\n- SJF (Optimal average waiting time)\n- Round Robin (Time quantum based)\n- Priority Scheduling (Starvation solved by Aging).`,
      },
      {
        pageNumber: 5,
        text: `Module 3: Memory Management & Paging:\nPaging is a memory management scheme that eliminates contiguous allocation.\nPhysical memory = Frames.\nLogical memory = Pages.\nAddress translation: Logical address (Page number 'p' + Offset 'd') converted via Page Table to Frame number.\n\nVirtual Memory & Page Faults:\nAllows execution of processes not fully loaded into RAM. Page fault brings missing page from disk to RAM.`,
      },
    ],
    summary: {
      executiveSummary:
        'This comprehensive study document covers foundational Operating System concepts, emphasizing Process Management, CPU Scheduling Algorithms, and Memory Paging Architecture. It details how the OS acts as a bridge between physical hardware and application software, balancing CPU utilization, fairness, and execution isolation.',
      shortSummary:
        'An Operating System manages computer hardware and system resources. A process is an active program managed via a Process Control Block (PCB), scheduled through algorithms like Round Robin and SJF, and backed by non-contiguous paging memory.',
      detailedSummary: `### 1. Operating System Overview & Core Architecture
An Operating System is system software that controls execution, manages hardware resources, and presents a clean, abstraction-oriented interface to applications.
- **Convenience**: Abstracting raw machine registers and hardware nuances into clean APIs.
- **Efficiency**: Multiplexing CPU, memory, and devices across multiple concurrent workflows.

### 2. Process Concepts and Control Structure
A **Process** is a program in active execution. Unlike passive binaries on disk, processes maintain dynamic runtime context across four primary memory segments:
1. **Text**: Assembly instructions and compiled code.
2. **Data**: Global and static variable storage.
3. **Heap**: Dynamic memory dynamically allocated via \`malloc\` or \`new\`.
4. **Stack**: Execution frames, activation records, parameters, and local variables.

### 3. Process Control Block (PCB) & Context Switching
The kernel tracks each active process through a **Process Control Block (PCB)**, which encapsulates:
- Current process state (New, Ready, Running, Waiting, Terminated).
- Program Counter & CPU hardware registers.
- Scheduling priority and memory mapping tables.

During a **Context Switch**, the CPU halts execution of one process, preserves its registers into its PCB, and restores the saved state of the next ready process. Because no application instructions execute during this period, context switching represents pure system overhead.

### 4. CPU Scheduling & Memory Management
- **Round Robin**: Enforces equal time slicing with a pre-configured time quantum.
- **Shortest Job First**: Minimizes mean waiting duration, though susceptible to starvation.
- **Paging & Virtual Memory**: Physical memory is split into fixed frames while logical memory is split into pages, eliminating external fragmentation and enabling virtual memory through demand paging.`,
      keyConcepts: [
        {
          id: 'c1',
          title: 'Process vs Program',
          explanation: 'A program is a passive set of instructions on disk, whereas a process is an active entity executing in memory with dedicated stack, heap, and registers.',
          relevance: 'Fundamental to multitasking and OS process isolation.',
        },
        {
          id: 'c2',
          title: 'Process Control Block (PCB)',
          explanation: 'The kernel data structure storing all vital state data for a process: state, program counter, register values, memory pointers, and open I/O handles.',
          relevance: 'Central to context switching and OS process scheduling.',
        },
        {
          id: 'c3',
          title: 'Context Switching',
          explanation: 'The mechanism of saving the state of the active running process into its PCB and restoring the state of another ready process into CPU registers.',
          relevance: 'Pure CPU overhead; optimizing switch latency is critical for responsiveness.',
        },
        {
          id: 'c4',
          title: 'Paging & Address Translation',
          explanation: 'Dividing logical memory into fixed pages and physical memory into frames. The page table translates logical addresses into physical frame addresses without requiring contiguous allocation.',
          relevance: 'Eliminates external fragmentation and enables virtual memory.',
        },
        {
          id: 'c5',
          title: 'CPU Scheduling Algorithms',
          explanation: 'Techniques like FCFS, SJF, Priority, and Round Robin used by the short-term scheduler to pick the next ready process for CPU execution.',
          relevance: 'Maximizes throughput and minimizes process waiting and turnaround time.',
        },
      ],
      keyTakeaways: [
        'An Operating System acts as an intermediary between users and hardware, prioritizing convenience and resource efficiency.',
        'A Process is a program in execution containing Text, Data, Heap, and Stack segments.',
        'The Process Control Block (PCB) holds all operational state required to pause and resume a process.',
        'Context switching is pure computational overhead; no user calculations occur while registers are swapped.',
        'The five primary process states are New, Ready, Running, Waiting, and Terminated.',
        'Paging avoids external fragmentation by decoupling logical addresses from physical memory frames.',
        'Round Robin scheduling guarantees fairness in time-sharing systems through fixed time quanta.',
      ],
      topics: ['Operating Systems', 'Process Management', 'PCB', 'Context Switching', 'Paging', 'CPU Scheduling'],
      estimatedReadingTimeMinutes: 7,
    },
    examQuestions: [
      {
        id: 'q1',
        category: '3 Mark',
        marks: 3,
        question: 'Define a Process and list its four memory components.',
        difficulty: 'Easy',
        keyPointsRequired: [
          'Definition: A program in execution.',
          'Four memory components: Text (code), Data (globals), Heap (dynamic memory), Stack (local variables/frames).',
        ],
        modelAnswer:
          'A process is an instance of a program in execution. While a program is a passive binary stored on disk, a process is an active entity. Its four core memory components are:\n1. Text Section: Executable machine code instructions.\n2. Data Section: Global and static variable storage.\n3. Heap: Memory dynamically allocated at runtime.\n4. Stack: Temporary storage for function parameters, local variables, and return addresses.',
        gradingCriteria: '1 mark for definition, 2 marks for naming and explaining the 4 components.',
      },
      {
        id: 'q2',
        category: '3 Mark',
        marks: 3,
        question: 'What is a Process Control Block (PCB)? What information does it hold?',
        difficulty: 'Easy',
        keyPointsRequired: [
          'Definition of PCB as the kernel data structure representing a process.',
          'Key fields: Process state, Program Counter, CPU registers, Memory management info.',
        ],
        modelAnswer:
          'A Process Control Block (PCB), also known as a Task Control Block, is a central data structure maintained by the OS kernel to manage each individual process. It contains:\n1. Process State (New, Ready, Running, etc.)\n2. Program Counter (address of next instruction)\n3. CPU Registers (accumulators, stack pointer)\n4. Memory Allocation Info (page tables, base/limit registers)\n5. Accounting and I/O status info.',
        gradingCriteria: '1 mark for correct definition, 2 marks for listing at least 4 distinct PCB fields.',
      },
      {
        id: 'q3',
        category: '3 Mark',
        marks: 3,
        question: 'What is context switching and why is it considered system overhead?',
        difficulty: 'Medium',
        keyPointsRequired: [
          'Context switch: Saving current process state in PCB and restoring the state of the scheduled process.',
          'Overhead reason: CPU performs no useful user work during switching.',
        ],
        modelAnswer:
          'Context switching is the procedure by which the CPU shifts execution from one process to another. The OS kernel saves the current state (registers, program counter) of the running process into its PCB, and restores the previously saved state of the new process from its respective PCB.\n\nIt is considered pure overhead because during the context switch, the processor is executing kernel register-saving routines rather than executing user instructions or progressing application computation.',
        gradingCriteria: '1.5 marks for mechanism, 1.5 marks for explaining overhead.',
      },
      {
        id: 'q4',
        category: '5 Mark',
        marks: 5,
        question: 'Explain the 5-state process lifecycle diagram with transitions.',
        difficulty: 'Medium',
        keyPointsRequired: [
          'List of 5 states: New, Ready, Running, Waiting, Terminated.',
          'Clear explanation of transitions: Admitted, Scheduler dispatch, Interrupt, I/O wait, I/O completion, Exit.',
        ],
        modelAnswer:
          'The lifecycle of an operating system process spans five fundamental states:\n\n1. New: The process is being created and its PCB initialized.\n   - Transition (Admitted): Moved to the Ready queue once memory is allocated.\n2. Ready: The process is loaded in main memory waiting for CPU allocation.\n   - Transition (Scheduler Dispatch): The short-term CPU scheduler assigns the CPU to this process.\n3. Running: Instructions are actively executing on the CPU core.\n   - Transition (Interrupt/Timer Expired): Time slice ends; returned to Ready state.\n   - Transition (I/O or Event Wait): Process requests I/O; moved to Waiting state.\n4. Waiting (Blocked): The process cannot execute until an external event (e.g. disk read, socket receive) completes.\n   - Transition (I/O or Event Completion): When the device signals completion, the process transitions back to the Ready queue.\n5. Terminated: Process finishes execution or is killed; resources are deallocated.',
        gradingCriteria: '2.5 marks for accurate state descriptions, 2.5 marks for correct transition mechanisms.',
      },
      {
        id: 'q5',
        category: '9 Mark',
        marks: 9,
        question: 'Describe Paging in memory management. Explain the logical-to-physical address translation mechanism with an architecture breakdown.',
        difficulty: 'Hard',
        keyPointsRequired: [
          'Paging definition: Non-contiguous memory allocation avoiding external fragmentation.',
          'Division into Pages and Frames.',
          'Address split: Page Number (p) and Offset (d).',
          'Page Table lookup and physical address generation.',
          'Advantages and comparison with segmentation.',
        ],
        modelAnswer:
          'Paging is a memory management scheme that permits the physical address space of a process to be non-contiguous. Prior to paging, contiguous allocation caused severe external fragmentation.\n\n1. Core Architecture:\n- Physical Memory is divided into fixed-sized blocks called Frames.\n- Logical Memory (the program view) is partitioned into blocks of identical size called Pages (typically 4 KB).\n\n2. Address Translation Scheme:\nA logical address generated by the CPU is conceptually split into two components:\n- Page Number (p): Used as an index into the process page table.\n- Page Offset (d): The specific byte location within the referenced page.\n\nTranslation Flow:\n1. The CPU emits a virtual logical address [p | d].\n2. The memory management unit (MMU) uses page number `p` to index the process Page Table.\n3. The Page Table entry reveals the base address of the physical frame `f`.\n4. The physical address is constructed by concatenating the frame number `f` with the original offset `d` [f | d].\n5. The memory bus accesses the exact physical byte at frame `f`, offset `d`.\n\n3. Advantages of Paging:\n- Eliminates external fragmentation because any free physical frame can be allocated to any process page.\n- Enables Virtual Memory and Demand Paging.\n- Simplifies memory swapping.\n\n4. Limitations:\n- Still subject to internal fragmentation (on average half a page per process).\n- Requires page table storage overhead in memory, mitigated via Translation Lookaside Buffers (TLB).',
        gradingCriteria: '2 marks for conceptual foundation, 4 marks for translation flow, 3 marks for trade-offs & TLB.',
      },
      {
        id: 'q6',
        category: 'MCQ',
        marks: 1,
        question: 'Which scheduling algorithm is non-preemptive and prone to the "Convoy Effect"?',
        difficulty: 'Easy',
        options: [
          'A) Round Robin (RR)',
          'B) First-Come, First-Served (FCFS)',
          'C) Shortest Remaining Time First (SRTF)',
          'D) Priority Scheduling',
        ],
        correctAnswer: 'B) First-Come, First-Served (FCFS)',
        modelAnswer:
          'FCFS (First-Come, First-Served) is non-preemptive. If a CPU-bound process with a huge CPU burst arrives first, all subsequent short I/O-bound processes must wait behind it in the ready queue, dragging down system throughput. This phenomenon is known as the Convoy Effect.',
        gradingCriteria: '1 mark for correct selection B.',
      },
    ],
    flashcards: [
      {
        id: 'fc1',
        question: 'What is a Process?',
        answer: 'A process is an active program currently in execution, possessing a program counter, memory stack, heap, and system resources.',
        category: 'Process Management',
        hint: 'Contrast it with a passive executable on disk.',
      },
      {
        id: 'fc2',
        question: 'What is a Process Control Block (PCB)?',
        answer: 'The kernel data structure holding all metadata and CPU context required to manage and switch a process (state, registers, memory pointers).',
        category: 'Process Management',
        hint: 'Task control structure in kernel memory.',
      },
      {
        id: 'fc3',
        question: 'What occurs during a Context Switch?',
        answer: 'The OS saves the execution context of the running process in its PCB and restores the saved state of the next ready process into the CPU registers.',
        category: 'System Architecture',
        hint: 'Why does it cause computational overhead?',
      },
      {
        id: 'fc4',
        question: 'What are the 5 states of a process lifecycle?',
        answer: '1. New, 2. Ready, 3. Running, 4. Waiting (Blocked), 5. Terminated.',
        category: 'Process Lifecycle',
        hint: 'Think from creation to termination.',
      },
      {
        id: 'fc5',
        question: 'How does Paging eliminate external fragmentation?',
        answer: 'By dividing physical memory into fixed-size Frames and logical memory into Pages of the same size, any free frame can host any page.',
        category: 'Memory Management',
        hint: 'Fixed size allocations vs contiguous blocks.',
      },
      {
        id: 'fc6',
        question: 'What is a Page Fault?',
        answer: 'An interrupt triggered when an application accesses a virtual memory page that is currently not mapped into physical RAM.',
        category: 'Virtual Memory',
        hint: 'Triggers demand paging from disk.',
      },
      {
        id: 'fc7',
        question: 'What is the "Convoy Effect" in CPU scheduling?',
        answer: 'A scenario in FCFS scheduling where multiple short I/O-bound processes are blocked waiting behind a single lengthy CPU-bound process.',
        category: 'CPU Scheduling',
        hint: 'Like small cars trapped behind a slow truck.',
      },
      {
        id: 'fc8',
        question: 'How does Aging prevent starvation in Priority Scheduling?',
        answer: 'Aging gradually increases the priority of processes that wait in the system for long periods until they are guaranteed execution.',
        category: 'CPU Scheduling',
        hint: 'Priority grows with wait time.',
      },
    ],
    chatHistory: [
      {
        id: 'msg1',
        role: 'model',
        text: 'Hello! I have indexed **Operating_System_Notes.pdf**. Ask me any question about process management, context switching, CPU scheduling, or memory paging!',
        timestamp: '10:00 AM',
        suggestedQuestions: [
          'What is process management?',
          'Explain context switching simply',
          'Give me exam questions on paging',
        ],
      },
    ],
  },
  {
    id: 'sample-networks-notes',
    name: 'Computer_Networks_Protocols.pdf',
    size: '8.1 MB',
    pageCount: 12,
    uploadDate: 'Sep 24, 2026',
    isSample: true,
    fullText: `COMPUTER NETWORKS & INTERNETWORKING PROTOCOLS
Module 1: Network Architecture & The OSI / TCP-IP Models
Computer networks enable data exchange between autonomous computing devices. The architecture is defined hierarchically through layered models.

The OSI 7-Layer Reference Model:
1. Physical Layer: Transmits raw bits over transmission media.
2. Data Link Layer: Node-to-node frame delivery, MAC addressing, error detection (CRC).
3. Network Layer: Host-to-host packet routing, logical IP addressing, congestion control.
4. Transport Layer: End-to-end process communication, flow control, reliability (TCP vs UDP).
5. Session Layer: Dialog management, checkpointing, session synchronization.
6. Presentation Layer: Translation, encryption, compression (e.g. SSL/TLS, ASCII, JPEG).
7. Application Layer: High-level network protocols for user applications (HTTP, DNS, SMTP).

The TCP/IP Protocol Suite:
Four primary layers: Network Access, Internet (IPv4, IPv6, ICMP, ARP), Transport (TCP, UDP), and Application (HTTP, DNS, SSH).

Module 2: Transport Layer: TCP vs UDP
Transmission Control Protocol (TCP):
- Connection-oriented protocol with a Three-Way Handshake (SYN, SYN-ACK, ACK).
- Reliable delivery: Sequence numbers, acknowledgments, retransmissions on timeout.
- Flow Control: Receiver Advertised Window (rwnd) prevents buffer overflow.
- Congestion Control: AIMD (Additive Increase, Multiplicative Decrease), Slow Start, Congestion Avoidance, Fast Retransmit.

User Datagram Protocol (UDP):
- Connectionless, lightweight, unreliable best-effort delivery.
- No handshakes, no acknowledgments, no congestion control.
- Preferred for real-time applications: VoIP, live video streaming, DNS lookups, online gaming.

Module 3: IP Addressing & Subnetting
IPv4 Addresses are 32 bits long, written in dotted-decimal notation.
Classless Inter-Domain Routing (CIDR) uses variable-length subnet masks (VLSM).
Example: 192.168.1.0/24 allows 256 addresses, with 254 usable host addresses.`,
    pages: [
      {
        pageNumber: 1,
        text: `COMPUTER NETWORKS & INTERNETWORKING PROTOCOLS\nModule 1: The OSI 7-Layer Model & TCP/IP\nPhysical -> Data Link -> Network -> Transport -> Session -> Presentation -> Application.\nKey difference: TCP/IP combines upper layers into Application layer.`,
      },
      {
        pageNumber: 2,
        text: `Module 2: Transport Layer Protocols\nTCP: Connection-oriented, 3-way handshake, reliable, flow and congestion control.\nUDP: Connectionless, lightweight, low-latency, best-effort.`,
      },
      {
        pageNumber: 3,
        text: `Module 3: IP Addressing & Routing\nIPv4: 32 bits, CIDR notation. Subnetting enables efficient IP block division.\nRouting Algorithms: Distance Vector (Bellman-Ford, RIP) and Link State (Dijkstra, OSPF).`,
      },
    ],
    summary: {
      executiveSummary:
        'This reference text dissects layered computer networking models (OSI and TCP/IP), contrasting transport layer protocols (reliable TCP vs low-latency UDP) and laying out IP addressing and subnetting rules.',
      shortSummary:
        'A comprehensive guide to networking architectures, comparing the 7-layer OSI model with TCP/IP, analyzing TCP reliability mechanisms versus UDP, and detailing subnetting techniques.',
      detailedSummary: `### 1. Layered Network Architecture
Network protocols rely on layer abstraction where each layer offers defined services to the layer above while shielding implementation complexities.
- **OSI Model**: 7 layers separating transmission, error-checking, routing, transport, sessions, and presentation.
- **TCP/IP Model**: Pragmatic 4-layer architecture powering the modern Internet.

### 2. Transport Layer Dynamics
- **TCP**: Employs sequence numbers, checksums, selective acknowledgments, and sliding window flow control.
- **UDP**: Minimal protocol header (8 bytes) prioritizing speed and predictable timing over retransmission.`,
      keyConcepts: [
        {
          id: 'cn1',
          title: 'OSI vs TCP/IP Models',
          explanation: 'OSI is a 7-layer theoretical reference architecture, while TCP/IP is a 4-layer production suite running the Internet.',
          relevance: 'Foundational framework for all telecommunications and web protocols.',
        },
        {
          id: 'cn2',
          title: 'TCP 3-Way Handshake',
          explanation: 'Connection establishment sequence using SYN, SYN-ACK, and ACK packets to synchronize sequence numbers.',
          relevance: 'Ensures reliable, sequenced transmission before data flows.',
        },
        {
          id: 'cn3',
          title: 'Flow Control vs Congestion Control',
          explanation: 'Flow control protects the receiver from being overwhelmed; Congestion control protects the intermediate network routers from packet drops.',
          relevance: 'Critical for network stability and optimal bandwidth saturation.',
        },
      ],
      keyTakeaways: [
        'The OSI model has 7 layers, while TCP/IP merges the top layers into the Application layer.',
        'TCP guarantees delivery via acknowledgments and sliding window flow control.',
        'UDP provides lowest latency for real-time voice, video, and gaming.',
        'CIDR and subnet masks prevent wasteful allocation of 32-bit IPv4 addresses.',
      ],
      topics: ['Computer Networks', 'OSI Model', 'TCP/IP', 'Transport Layer', 'Subnetting'],
      estimatedReadingTimeMinutes: 5,
    },
    examQuestions: [
      {
        id: 'cnq1',
        category: '3 Mark',
        marks: 3,
        question: 'Differentiate between TCP and UDP with three key distinctions.',
        difficulty: 'Easy',
        keyPointsRequired: ['Connection-oriented vs Connectionless', 'Reliable vs Unreliable', 'Speed / Overhead differences'],
        modelAnswer:
          '1. Connection: TCP is connection-oriented (requires 3-way handshake); UDP is connectionless.\n2. Reliability: TCP guarantees delivery through sequence numbers and retransmissions; UDP provides best-effort delivery without ACK.\n3. Overhead & Speed: TCP has a 20-byte minimum header and higher latency; UDP has a lightweight 8-byte header and minimal latency.',
        gradingCriteria: '1 mark for each valid technical distinction.',
      },
      {
        id: 'cnq2',
        category: '5 Mark',
        marks: 5,
        question: 'Explain the TCP Three-Way Handshake with a sequence flow diagram.',
        difficulty: 'Medium',
        keyPointsRequired: ['SYN sent with initial seq number', 'SYN-ACK replied with acknowledgment', 'ACK sent to finalize connection'],
        modelAnswer:
          'The TCP 3-Way Handshake initializes a reliable connection between Client and Server:\n\nStep 1 (SYN): Client sends a SYN segment with Initial Sequence Number (ISN_C) to request connection.\nStep 2 (SYN-ACK): Server receives SYN, allocates buffers, and responds with SYN-ACK containing its own sequence number (ISN_S) and an ACK = ISN_C + 1.\nStep 3 (ACK): Client replies with ACK = ISN_S + 1. The socket connection enters the ESTABLISHED state and data transfer can begin.',
        gradingCriteria: '1.5 marks per step, 0.5 mark for socket state explanation.',
      },
    ],
    flashcards: [
      {
        id: 'cnfc1',
        question: 'What is the purpose of the Transport Layer?',
        answer: 'To provide end-to-end communication services, process-to-process multiplexing, and error/flow control between host applications.',
        category: 'OSI Model',
      },
      {
        id: 'cnfc2',
        question: 'What are the 3 steps of TCP connection establishment?',
        answer: '1. SYN (Client -> Server)\n2. SYN-ACK (Server -> Client)\n3. ACK (Client -> Server)',
        category: 'TCP Protocol',
      },
    ],
  },
];
