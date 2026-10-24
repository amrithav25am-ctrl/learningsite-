import { Subject } from '../types';

export const CURRICULUM_DATA: Subject[] = [
  {
    id: 'c',
    name: 'C Programming',
    icon: '⚙️',
    tagline: 'Master raw memory, pointers, stack vs heap, and hardware-level execution.',
    color: '#38bdf8', // sky
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    borderColor: 'border-sky-500/30',
    description: 'Understand what actually happens in RAM when code runs: memory addresses, pointer dereferencing, dynamic heap allocation, and array decay.',
    topics: [
      {
        id: 'c-pointers',
        subjectId: 'c',
        title: 'Pointers & Memory Dereferencing',
        tagline: 'Watch how pointers store memory addresses and mutate target variables directly.',
        difficulty: 'Beginner',
        visualType: 'code-execution',
        language: 'c',
        conceptOverview: 'In C, variables reside at physical RAM addresses. A pointer is simply an integer holding another variable’s hexadecimal memory address. Dereferencing (*p) travels down the pointer arrow to read or mutate the target cell directly.',
        keyVisualTakeaway: 'Pointer p contains the hexadecimal address of a. Writing to *p changes the value in a’s memory cell without touching a directly.',
        initialCode: `#include <stdio.h>

int main() {
    int score = 42;
    int *ptr = &score;
    
    *ptr = 99;
    int bonus = *ptr + 10;
    
    return 0;
}`,
        frames: [
          {
            step: 1,
            line: 4,
            code: 'int score = 42;',
            action: 'Allocating integer score on main stack frame',
            explanation: 'The compiler allocates 4 bytes on the call stack at address 0x7ffd10 for variable "score" and writes value 42.',
            variables: [{ name: 'score', value: '42', type: 'int', address: '0x7ffd10', changed: true }],
            stack: [
              {
                frameName: 'main()',
                slots: [{ name: 'score', address: '0x7ffd10', value: '42', type: 'int' }]
              }
            ],
            heap: [],
            activeMemoryAddress: '0x7ffd10',
            visualTip: 'Memory cell 0x7ffd10 now contains binary 42.'
          },
          {
            step: 2,
            line: 5,
            code: 'int *ptr = &score;',
            action: 'Creating pointer ptr referencing address of score',
            explanation: 'The address-of operator (&) extracts 0x7ffd10. Pointer "ptr" is placed at 0x7ffd18 and stores the address of "score".',
            variables: [
              { name: 'score', value: '42', type: 'int', address: '0x7ffd10' },
              { name: 'ptr', value: '0x7ffd10', type: 'int*', address: '0x7ffd18', pointsTo: '0x7ffd10', changed: true }
            ],
            stack: [
              {
                frameName: 'main()',
                slots: [
                  { name: 'score', address: '0x7ffd10', value: '42', type: 'int' },
                  { name: 'ptr', address: '0x7ffd18', value: '0x7ffd10', type: 'int*', pointsTo: '0x7ffd10' }
                ]
              }
            ],
            heap: [],
            activeMemoryAddress: '0x7ffd18',
            visualTip: 'Notice the arrow from ptr (0x7ffd18) pointing directly into score (0x7ffd10).'
          },
          {
            step: 3,
            line: 7,
            code: '*ptr = 99;',
            action: 'Dereferencing ptr (*ptr) and writing 99 into target cell',
            explanation: 'The dereference operator (*) follows the pointer arrow to address 0x7ffd10 and overwrites its contents with 99. The variable "score" is modified!',
            variables: [
              { name: 'score', value: '99', type: 'int', address: '0x7ffd10', changed: true },
              { name: 'ptr', value: '0x7ffd10', type: 'int*', address: '0x7ffd18', pointsTo: '0x7ffd10' }
            ],
            stack: [
              {
                frameName: 'main()',
                slots: [
                  { name: 'score', address: '0x7ffd10', value: '99', type: 'int' },
                  { name: 'ptr', address: '0x7ffd18', value: '0x7ffd10', type: 'int*', pointsTo: '0x7ffd10' }
                ]
              }
            ],
            heap: [],
            activeMemoryAddress: '0x7ffd10',
            visualTip: 'Notice how score changed from 42 to 99 even though we wrote to *ptr.'
          },
          {
            step: 4,
            line: 8,
            code: 'int bonus = *ptr + 10;',
            action: 'Reading *ptr (99) + 10 and allocating bonus',
            explanation: 'The CPU reads the value at 0x7ffd10 (99), adds 10 to get 109, and stores it in new stack variable "bonus" at 0x7ffd20.',
            variables: [
              { name: 'score', value: '99', type: 'int', address: '0x7ffd10' },
              { name: 'ptr', value: '0x7ffd10', type: 'int*', address: '0x7ffd18', pointsTo: '0x7ffd10' },
              { name: 'bonus', value: '109', type: 'int', address: '0x7ffd20', changed: true }
            ],
            stack: [
              {
                frameName: 'main()',
                slots: [
                  { name: 'score', address: '0x7ffd10', value: '99', type: 'int' },
                  { name: 'ptr', address: '0x7ffd18', value: '0x7ffd10', type: 'int*', pointsTo: '0x7ffd10' },
                  { name: 'bonus', address: '0x7ffd20', value: '109', type: 'int' }
                ]
              }
            ],
            heap: [],
            activeMemoryAddress: '0x7ffd20',
            visualTip: 'Dereference reads the target cell just like using the variable directly.'
          }
        ],
        quiz: [
          {
            id: 'cq-1',
            topicId: 'c-pointers',
            subjectId: 'c',
            question: 'If int x = 50; int *p = &x; what does the expression *p evaluate to?',
            codeSnippet: 'int x = 50;\nint *p = &x;',
            options: [
              'The memory address of x (e.g. 0x7ffd10)',
              'The value stored inside x (50)',
              'The memory address of p itself',
              'A compilation error'
            ],
            correctIndex: 1,
            explanation: 'The unary * operator dereferences the pointer, yielding the value stored at the address p holds.',
            visualDetail: 'Pointer p contains 0x7ffd10 -> dereferencing *p fetches the 50 inside that memory box.'
          },
          {
            id: 'cq-2',
            topicId: 'c-pointers',
            subjectId: 'c',
            question: 'What happens if you execute *ptr = 100 when ptr is NULL or uninitialized?',
            codeSnippet: 'int *ptr = NULL;\n*ptr = 100;',
            options: [
              'C allocates automatic memory on the heap',
              'Segmentation Fault (crash due to invalid memory write)',
              'ptr is set to 100',
              'Nothing, NULL ignores writes'
            ],
            correctIndex: 1,
            explanation: 'Dereferencing a NULL or wild pointer attempts to write to a protected memory region (0x0), triggering a CPU page fault (Segmentation Fault).',
            visualDetail: 'NULL points to address 0x0 which is guarded by the OS memory management unit (MMU).'
          }
        ]
      },
      {
        id: 'c-malloc',
        subjectId: 'c',
        title: 'Stack vs Heap (malloc & free)',
        tagline: 'Visualize dynamic memory allocation on the Heap and avoiding memory leaks.',
        difficulty: 'Intermediate',
        visualType: 'code-execution',
        language: 'c',
        conceptOverview: 'Stack memory is automatically managed and fast, but limited to function lifetimes. The Heap is dynamic global memory allocated via malloc() and lives until you explicitly call free(). If you lose the pointer before calling free(), a memory leak occurs.',
        keyVisualTakeaway: 'The pointer variable lives on the fast Stack, but the actual data buffer lives across the memory boundary in the dynamic Heap.',
        initialCode: `#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(3 * sizeof(int));
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    free(arr);
    return 0;
}`,
        frames: [
          {
            step: 1,
            line: 4,
            code: 'int *arr = (int*)malloc(3 * sizeof(int));',
            action: 'Requesting 12 bytes from OS Heap manager',
            explanation: 'malloc allocates 12 contiguous bytes (3 ints) on the Heap at address 0x10a000. Stack variable "arr" stores this Heap address.',
            variables: [{ name: 'arr', value: '0x10a000', type: 'int*', address: '0x7ffd00', pointsTo: '0x10a000', changed: true }],
            stack: [
              {
                frameName: 'main()',
                slots: [{ name: 'arr', address: '0x7ffd00', value: '0x10a000', type: 'int*', pointsTo: '0x10a000' }]
              }
            ],
            heap: [
              { address: '0x10a000', label: 'malloc(3*sizeof(int))', value: '[?, ?, ?]', type: 'int[3]' }
            ],
            activeMemoryAddress: '0x10a000',
            visualTip: 'Stack pointer "arr" crosses the memory boundary into the Heap.'
          },
          {
            step: 2,
            line: 5,
            code: 'arr[0] = 10; arr[1] = 20;',
            action: 'Populating Heap buffer elements',
            explanation: 'arr[0] writes to 0x10a000, arr[1] writes to 0x10a004 (+4 bytes pointer offset).',
            variables: [{ name: 'arr', value: '0x10a000', type: 'int*', address: '0x7ffd00', pointsTo: '0x10a000' }],
            stack: [
              {
                frameName: 'main()',
                slots: [{ name: 'arr', address: '0x7ffd00', value: '0x10a000', type: 'int*', pointsTo: '0x10a000' }]
              }
            ],
            heap: [
              { address: '0x10a000', label: 'malloc(3*sizeof(int))', value: '[10, 20, ?]', type: 'int[3]' }
            ],
            activeMemoryAddress: '0x10a000',
            visualTip: 'Each index increments memory address by sizeof(int) = 4 bytes.'
          },
          {
            step: 3,
            line: 7,
            code: 'arr[2] = 30;',
            action: 'Populating last element in Heap block',
            explanation: '0x10a008 receives integer 30. The entire 12-byte block is now populated.',
            variables: [{ name: 'arr', value: '0x10a000', type: 'int*', address: '0x7ffd00', pointsTo: '0x10a000' }],
            stack: [
              {
                frameName: 'main()',
                slots: [{ name: 'arr', address: '0x7ffd00', value: '0x10a000', type: 'int*', pointsTo: '0x10a000' }]
              }
            ],
            heap: [
              { address: '0x10a000', label: 'malloc(3*sizeof(int))', value: '[10, 20, 30]', type: 'int[3]' }
            ],
            activeMemoryAddress: '0x10a000',
            visualTip: 'Heap buffer is full: [10, 20, 30].'
          },
          {
            step: 4,
            line: 8,
            code: 'free(arr);',
            action: 'Deallocating Heap block and returning bytes to OS',
            explanation: 'free() releases the 12 bytes at 0x10a000 back to the heap pool. Note: arr still holds 0x10a000 unless set to NULL (a dangling pointer).',
            variables: [{ name: 'arr', value: '0x10a000 (dangling)', type: 'int*', address: '0x7ffd00', changed: true }],
            stack: [
              {
                frameName: 'main()',
                slots: [{ name: 'arr', address: '0x7ffd00', value: '0x10a000 (dangling)', type: 'int*' }]
              }
            ],
            heap: [],
            activeMemoryAddress: '0x7ffd00',
            visualTip: 'Heap memory is freed! Best practice: always do arr = NULL next to avoid dangling pointer bugs.'
          }
        ],
        quiz: [
          {
            id: 'cq-3',
            topicId: 'c-malloc',
            subjectId: 'c',
            question: 'What is a "Memory Leak" in C?',
            options: [
              'When the CPU stack overflows from infinite recursion',
              'When dynamically allocated Heap memory is never freed and the pointer reference is lost',
              'When you dereference a NULL pointer',
              'When an integer variable exceeds 2^31 - 1'
            ],
            correctIndex: 1,
            explanation: 'When heap memory is allocated with malloc() but never released with free(), and all pointers to that address are lost, the memory cannot be reclaimed until program termination.',
            visualDetail: 'The orphaned heap box remains marooned with no incoming arrows.'
          }
        ]
      }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    tagline: 'Visualize dynamic typing, recursion call trees, list slicing references, and hash maps.',
    color: '#10b981', // emerald
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    borderColor: 'border-emerald-500/30',
    description: 'Demystify Python under the hood: how names bind to objects in memory, how the recursion stack builds up and unwinds, and how slicing creates shallow copies.',
    topics: [
      {
        id: 'py-recursion',
        subjectId: 'python',
        title: 'Recursion Call Tree & Stack Unwinding',
        tagline: 'Watch stack frames pile up until the base case triggers cascading returns.',
        difficulty: 'Intermediate',
        visualType: 'code-execution',
        language: 'python',
        conceptOverview: 'A recursive function breaks down a problem by calling itself with smaller inputs. Each call pushes a new isolated stack frame onto the Call Stack with its own local variables. Once the base case is hit, stack frames pop and return values backwards.',
        keyVisualTakeaway: 'The Call Stack grows downward as functions call each other, and shrinks upward as return values resolve.',
        initialCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(3)`,
        frames: [
          {
            step: 1,
            line: 6,
            code: 'result = factorial(3)',
            action: 'Invoking factorial(3) -> pushes frame 1',
            explanation: 'The interpreter enters factorial with argument n=3. A new stack frame factorial(n=3) is allocated.',
            variables: [{ name: 'n', value: '3', type: 'int', changed: true }],
            stack: [
              { frameName: 'module (global)', slots: [{ name: 'result', address: '0x101', value: '<unbound>' }] },
              { frameName: 'factorial(n=3)', slots: [{ name: 'n', address: '0x102', value: '3' }] }
            ],
            heap: [],
            visualTip: 'Call Stack depth: 1. Waiting for return value of factorial(2).'
          },
          {
            step: 2,
            line: 4,
            code: 'return n * factorial(n - 1)  # n=3 calls factorial(2)',
            action: 'Invoking factorial(2) -> pushes frame 2',
            explanation: 'Since 3 > 1, factorial(3) calls factorial(2). A second frame is placed on top of the stack.',
            variables: [{ name: 'n', value: '2', type: 'int', changed: true }],
            stack: [
              { frameName: 'module (global)', slots: [{ name: 'result', address: '0x101', value: '<unbound>' }] },
              { frameName: 'factorial(n=3)', slots: [{ name: 'n', address: '0x102', value: '3 (waiting for 3 * ?)' }] },
              { frameName: 'factorial(n=2)', slots: [{ name: 'n', address: '0x103', value: '2' }] }
            ],
            heap: [],
            visualTip: 'Call Stack depth: 2. Both frames are active in memory.'
          },
          {
            step: 3,
            line: 4,
            code: 'return n * factorial(n - 1)  # n=2 calls factorial(1)',
            action: 'Invoking factorial(1) -> pushes frame 3 (Base Case)',
            explanation: 'factorial(2) calls factorial(1). A third frame is pushed. Here n <= 1 triggers the base case!',
            variables: [{ name: 'n', value: '1', type: 'int', changed: true }],
            stack: [
              { frameName: 'module (global)', slots: [{ name: 'result', address: '0x101', value: '<unbound>' }] },
              { frameName: 'factorial(n=3)', slots: [{ name: 'n', address: '0x102', value: '3 (waiting)' }] },
              { frameName: 'factorial(n=2)', slots: [{ name: 'n', address: '0x103', value: '2 (waiting)' }] },
              { frameName: 'factorial(n=1)', slots: [{ name: 'n', address: '0x104', value: '1 (BASE CASE)' }] }
            ],
            heap: [],
            visualTip: 'Peak stack depth reached! Base case reached: returns 1.'
          },
          {
            step: 4,
            line: 3,
            code: 'return 1  # Unwinding factorial(1)',
            action: 'Popping factorial(1) and returning 1 to factorial(2)',
            explanation: 'factorial(1) pops off the stack. factorial(2) receives 1 and computes: 2 * 1 = 2.',
            variables: [{ name: 'returned', value: '1', type: 'int', changed: true }],
            stack: [
              { frameName: 'module (global)', slots: [{ name: 'result', address: '0x101', value: '<unbound>' }] },
              { frameName: 'factorial(n=3)', slots: [{ name: 'n', address: '0x102', value: '3 (waiting)' }] },
              { frameName: 'factorial(n=2)', slots: [{ name: 'n', address: '0x103', value: '2 * 1 = 2' }] }
            ],
            heap: [],
            visualTip: 'Unwinding! Frame 1 popped.'
          },
          {
            step: 5,
            line: 6,
            code: 'result = 6',
            action: 'Popping factorial(2) and factorial(3) -> result = 6',
            explanation: 'factorial(2) returns 2. factorial(3) computes 3 * 2 = 6 and returns 6 to global scope.',
            variables: [{ name: 'result', value: '6', type: 'int', changed: true }],
            stack: [
              { frameName: 'module (global)', slots: [{ name: 'result', address: '0x101', value: '6' }] }
            ],
            heap: [],
            visualTip: 'All recursive frames cleared. Final result: 6.'
          }
        ],
        quiz: [
          {
            id: 'pyq-1',
            topicId: 'py-recursion',
            subjectId: 'python',
            question: 'What error occurs in Python if a recursive function never reaches its base case?',
            options: [
              'ZeroDivisionError',
              'RecursionError: maximum recursion depth exceeded',
              'IndentationError',
              'Segmentation Fault automatically caught'
            ],
            correctIndex: 1,
            explanation: 'Python sets a default recursion limit (usually 1000 frames) to guard against filling all memory, throwing a RecursionError when exceeded.',
            visualDetail: 'Stack frames keep piling indefinitely without ever unwinding.'
          }
        ]
      },
      {
        id: 'py-slicing',
        subjectId: 'python',
        title: 'List Slicing & References',
        tagline: 'Understand the difference between mutating a shared reference vs slicing a shallow copy.',
        difficulty: 'Beginner',
        visualType: 'code-execution',
        language: 'python',
        conceptOverview: 'In Python, variable assignment (b = a) creates an alias pointing to the identical list object in heap memory. Slicing (c = a[:]) creates a new distinct list container containing references to the elements.',
        keyVisualTakeaway: 'Assignment creates two arrows pointing to one list. Slicing creates a new list object with its own distinct memory id.',
        initialCode: `a = [10, 20, 30]
b = a          # Reference alias
c = a[:]       # Shallow copy slice

b.append(40)
c.append(99)`,
        frames: [
          {
            step: 1,
            line: 1,
            code: 'a = [10, 20, 30]',
            action: 'Allocating list object at id 0x500',
            explanation: 'Python creates a list object [10, 20, 30] in heap memory at id 0x500 and binds identifier "a" to it.',
            variables: [{ name: 'a', value: '[10, 20, 30]', type: 'list', address: '0x500', changed: true }],
            stack: [
              { frameName: 'global', slots: [{ name: 'a', address: '0x10', value: 'ref -> 0x500' }] }
            ],
            heap: [{ address: '0x500', label: 'list', value: '[10, 20, 30]' }],
            visualTip: 'a points to heap list 0x500.'
          },
          {
            step: 2,
            line: 2,
            code: 'b = a',
            action: 'Alias creation: b points to same object 0x500',
            explanation: 'No copy is made! Variable "b" is simply an additional name pointing to the exact same list at 0x500.',
            variables: [
              { name: 'a', value: '[10, 20, 30]', type: 'list', address: '0x500' },
              { name: 'b', value: '[10, 20, 30]', type: 'list', address: '0x500', changed: true }
            ],
            stack: [
              { frameName: 'global', slots: [
                { name: 'a', address: '0x10', value: 'ref -> 0x500' },
                { name: 'b', address: '0x18', value: 'ref -> 0x500' }
              ] }
            ],
            heap: [{ address: '0x500', label: 'list', value: '[10, 20, 30]' }],
            visualTip: 'Both a and b point to 0x500! Modifying one mutates both.'
          },
          {
            step: 3,
            line: 3,
            code: 'c = a[:]',
            action: 'Slice copies elements into NEW list object 0x580',
            explanation: 'The slice [:] creates a brand new list container at 0x580 containing copies of references.',
            variables: [
              { name: 'a', value: '[10, 20, 30]', type: 'list', address: '0x500' },
              { name: 'b', value: '[10, 20, 30]', type: 'list', address: '0x500' },
              { name: 'c', value: '[10, 20, 30]', type: 'list', address: '0x580', changed: true }
            ],
            stack: [
              { frameName: 'global', slots: [
                { name: 'a', address: '0x10', value: 'ref -> 0x500' },
                { name: 'b', address: '0x18', value: 'ref -> 0x500' },
                { name: 'c', address: '0x20', value: 'ref -> 0x580' }
              ] }
            ],
            heap: [
              { address: '0x500', label: 'list', value: '[10, 20, 30]' },
              { address: '0x580', label: 'list', value: '[10, 20, 30]' }
            ],
            visualTip: 'c has its own unique memory box 0x580.'
          },
          {
            step: 4,
            line: 5,
            code: 'b.append(40); c.append(99)',
            action: 'Mutating list 0x500 and list 0x580 separately',
            explanation: 'Appending to b mutates object 0x500 (affecting a). Appending to c only modifies 0x580.',
            variables: [
              { name: 'a', value: '[10, 20, 30, 40]', type: 'list', address: '0x500', changed: true },
              { name: 'b', value: '[10, 20, 30, 40]', type: 'list', address: '0x500' },
              { name: 'c', value: '[10, 20, 30, 99]', type: 'list', address: '0x580', changed: true }
            ],
            stack: [
              { frameName: 'global', slots: [
                { name: 'a', address: '0x10', value: 'ref -> 0x500' },
                { name: 'b', address: '0x18', value: 'ref -> 0x500' },
                { name: 'c', address: '0x20', value: 'ref -> 0x580' }
              ] }
            ],
            heap: [
              { address: '0x500', label: 'list', value: '[10, 20, 30, 40]' },
              { address: '0x580', label: 'list', value: '[10, 20, 30, 99]' }
            ],
            visualTip: 'Notice: a has 40 because it shared object 0x500 with b!'
          }
        ],
        quiz: [
          {
            id: 'pyq-2',
            topicId: 'py-slicing',
            subjectId: 'python',
            question: 'After executing list1 = [1, 2]; list2 = list1; list2[0] = 99, what is list1[0]?',
            options: ['1', '99', 'None', 'IndexError'],
            correctIndex: 1,
            explanation: 'list2 and list1 both reference the exact same underlying list object in memory, so mutating list2 also mutates list1.',
            visualDetail: 'Both variables hold the pointer to the same memory address.'
          }
        ]
      }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    tagline: 'Understand the JVM: Stack vs Heap, Object references, and String Constant Pool.',
    color: '#f59e0b', // amber
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    borderColor: 'border-amber-500/30',
    description: 'Visualize Java Virtual Machine memory management: primitive types stored directly on the stack vs objects instantiated on the heap with garbage collection.',
    topics: [
      {
        id: 'java-references',
        subjectId: 'java',
        title: 'Stack vs Heap Object References',
        tagline: 'See how reference variables hold pointers to Heap instances and how reassignment leaves garbage.',
        difficulty: 'Beginner',
        visualType: 'code-execution',
        language: 'java',
        conceptOverview: 'In Java, variables declared inside methods reside on the Thread Stack. Primitive types (int, boolean, double) hold their raw values directly. Reference types (String, User, Object) hold 64-bit addresses pointing to object instances allocated on the JVM Heap.',
        keyVisualTakeaway: 'Reassigning a reference variable cuts its old pointer arrow. If an object on the Heap has 0 incoming arrows, it becomes eligible for Garbage Collection.',
        initialCode: `class Node {
    int val;
    Node(int v) { this.val = v; }
}

public class Main {
    public static void main(String[] args) {
        Node n1 = new Node(10);
        Node n2 = n1;
        n2.val = 50;
        n1 = null; // n2 still holds reference!
    }
}`,
        frames: [
          {
            step: 1,
            line: 8,
            code: 'Node n1 = new Node(10);',
            action: 'Instantiating Node(10) on JVM Heap at 0x90a0',
            explanation: 'The JVM allocates space for a Node object on the Heap, runs the constructor setting val = 10, and places the memory reference 0x90a0 in local variable n1.',
            variables: [{ name: 'n1', value: 'ref@0x90a0', type: 'Node', address: '0x90a0', changed: true }],
            stack: [
              { frameName: 'main(String[] args)', slots: [{ name: 'n1', address: 'stack:0x04', value: '0x90a0', type: 'Node' }] }
            ],
            heap: [{ address: '0x90a0', label: 'Node', value: '{ val: 10 }', fields: [{ key: 'val', value: '10' }] }],
            visualTip: 'n1 holds reference to Heap object 0x90a0.'
          },
          {
            step: 2,
            line: 9,
            code: 'Node n2 = n1;',
            action: 'Copying reference 0x90a0 into n2',
            explanation: 'Java copies the address by value. Now n2 points to the identical Node object on the Heap.',
            variables: [
              { name: 'n1', value: 'ref@0x90a0', type: 'Node', address: '0x90a0' },
              { name: 'n2', value: 'ref@0x90a0', type: 'Node', address: '0x90a0', changed: true }
            ],
            stack: [
              { frameName: 'main(String[] args)', slots: [
                { name: 'n1', address: 'stack:0x04', value: '0x90a0', type: 'Node' },
                { name: 'n2', address: 'stack:0x08', value: '0x90a0', type: 'Node' }
              ] }
            ],
            heap: [{ address: '0x90a0', label: 'Node', value: '{ val: 10 }', fields: [{ key: 'val', value: '10' }] }],
            visualTip: 'Two references point to the same object on the Heap.'
          },
          {
            step: 3,
            line: 10,
            code: 'n2.val = 50;',
            action: 'Mutating field val through n2 pointer',
            explanation: 'Following n2 to address 0x90a0, the field "val" is updated to 50. Since n1 points here too, n1.val is also 50.',
            variables: [
              { name: 'n1', value: 'ref@0x90a0', type: 'Node', address: '0x90a0' },
              { name: 'n2', value: 'ref@0x90a0', type: 'Node', address: '0x90a0' }
            ],
            stack: [
              { frameName: 'main(String[] args)', slots: [
                { name: 'n1', address: 'stack:0x04', value: '0x90a0', type: 'Node' },
                { name: 'n2', address: 'stack:0x08', value: '0x90a0', type: 'Node' }
              ] }
            ],
            heap: [{ address: '0x90a0', label: 'Node', value: '{ val: 50 }', fields: [{ key: 'val', value: '50' }] }],
            visualTip: 'Object state changed to val: 50.'
          },
          {
            step: 4,
            line: 11,
            code: 'n1 = null;',
            action: 'Severing n1 pointer arrow -> points to null',
            explanation: 'n1 is set to null, but object 0x90a0 is NOT garbage collected because n2 still retains a live reference arrow!',
            variables: [
              { name: 'n1', value: 'null', type: 'Node', changed: true },
              { name: 'n2', value: 'ref@0x90a0', type: 'Node', address: '0x90a0' }
            ],
            stack: [
              { frameName: 'main(String[] args)', slots: [
                { name: 'n1', address: 'stack:0x04', value: 'null', type: 'Node' },
                { name: 'n2', address: 'stack:0x08', value: '0x90a0', type: 'Node' }
              ] }
            ],
            heap: [{ address: '0x90a0', label: 'Node (Retained by n2)', value: '{ val: 50 }', fields: [{ key: 'val', value: '50' }] }],
            visualTip: 'Object 0x90a0 survives because n2 is still holding onto it!'
          }
        ],
        quiz: [
          {
            id: 'jq-1',
            topicId: 'java-references',
            subjectId: 'java',
            question: 'When does an object on the Java Heap become eligible for Garbage Collection?',
            options: [
              'Immediately when any method finishes executing',
              'When all active references to the object are gone (unreachable from GC roots)',
              'Only when System.gc() is explicitly executed',
              'When the object has been in memory for more than 5 minutes'
            ],
            correctIndex: 1,
            explanation: 'The JVM Garbage Collector detects objects that have zero reachable references from stack roots, static fields, or active threads.',
            visualDetail: 'No remaining arrow connects to the heap box.'
          }
        ]
      }
    ]
  },
  {
    id: 'math',
    name: 'Engineering Mathematics',
    icon: '📐',
    tagline: 'Visualize linear transformations, calculus derivatives, Riemann sums, and Fourier harmonics.',
    color: '#8b5cf6', // violet
    badgeBg: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    borderColor: 'border-violet-500/30',
    description: 'Math without intimidating text walls: interact with 2D coordinate grid morphing, drag tangent secants to zero, watch Riemann rectangles converge to integrals, and synthesize audio-frequency Fourier waves.',
    topics: [
      {
        id: 'math-matrix-transform',
        subjectId: 'math',
        title: 'Linear Transformations & Matrix Grid Distortion',
        tagline: 'Drag standard basis vectors i-hat and j-hat to watch the 2D plane morph and see determinant area.',
        difficulty: 'Intermediate',
        visualType: 'matrix-transform',
        conceptOverview: 'A 2x2 matrix is not a table of numbers—it is a geometric transformation instructions manual. The first column tells you where basis vector i-hat (1, 0) lands, and the second column tells you where j-hat (0, 1) lands. The determinant is the factor by which area is scaled.',
        keyVisualTakeaway: 'The determinant represents the signed area of the unit square after transformation. If det = 0, space collapses into a line or point!',
        mathConfig: {
          type: 'matrix',
          defaultMatrix: [[1.5, 0.5], [0.5, 1.2]],
          formula: 'T(v) = [ [a, b], [c, d] ] * v'
        },
        quiz: [
          {
            id: 'mq-1',
            topicId: 'math-matrix-transform',
            subjectId: 'math',
            question: 'Geometrically, what does a determinant of 0 mean for a 2x2 linear transformation matrix?',
            options: [
              'The matrix reflects vectors across the y-axis',
              'The transformation squishes all 2D space onto a 1D line or a single 0D point (loss of dimension)',
              'The transformation leaves all areas unchanged',
              'Vectors rotate by exactly 90 degrees'
            ],
            correctIndex: 1,
            explanation: 'The determinant measures the scaling factor of area. A determinant of 0 means the unit square’s area becomes 0, collapsing 2D space into a lower dimension where inverse transformations are impossible.',
            visualDetail: 'The colored unit square flattens completely into a flat line segment.'
          },
          {
            id: 'mq-2',
            topicId: 'math-matrix-transform',
            subjectId: 'math',
            question: 'What is an "eigenvector" of a linear transformation?',
            options: [
              'A vector whose direction remains unchanged during the transformation (only scaled by eigenvalue lambda)',
              'A vector that always has length 1',
              'The orthogonal projection of the determinant',
              'A vector perpendicular to the basis vectors'
            ],
            correctIndex: 0,
            explanation: 'By definition, Av = lambda * v. An eigenvector does not rotate out of its span; it simply stretches, shrinks, or flips along its original line.',
            visualDetail: 'The vector arrow stays on the same trajectory line before and after matrix deformation.'
          }
        ]
      },
      {
        id: 'math-calculus-derivative',
        subjectId: 'math',
        title: 'Calculus: Tangent Line & Derivative Limit',
        tagline: 'Slide delta-x to zero to watch the secant line snap into the instantaneous tangent line.',
        difficulty: 'Beginner',
        visualType: 'calculus',
        conceptOverview: 'The derivative is simply the instantaneous rate of change. When we pick two points on a curve separated by delta-x, the secant line has average slope (f(x+dx) - f(x))/dx. As delta-x shrinks to zero, this secant line smoothly pivots into the tangent line.',
        keyVisualTakeaway: 'The derivative f\'(x) is the slope of the tangent line at point x. Where f\'(x) = 0, the curve reaches local peaks or valleys.',
        mathConfig: {
          type: 'derivative',
          formula: 'f(x) = x^2 - 2x'
        },
        quiz: [
          {
            id: 'mq-3',
            topicId: 'math-calculus-derivative',
            subjectId: 'math',
            question: 'What happens to the secant line between (x, f(x)) and (x + dx, f(x + dx)) as dx approaches 0?',
            options: [
              'It rotates infinitely fast into a vertical asymptote',
              'It converges exactly to the tangent line at x, with slope equal to f\'(x)',
              'Its slope becomes undefined and vanishes',
              'It turns into the integral curve'
            ],
            correctIndex: 1,
            explanation: 'The fundamental definition of the derivative is the limit of the secant slope as dx -> 0, which forms the instantaneous tangent line.',
            visualDetail: 'The two points coalesce into a single contact point with slope matching the curve contour.'
          }
        ]
      },
      {
        id: 'math-riemann-integral',
        subjectId: 'math',
        title: 'Calculus: Riemann Sums & Definite Integrals',
        tagline: 'Increase the number of rectangle slices from 2 to 50 to see approximation errors vanish.',
        difficulty: 'Intermediate',
        visualType: 'calculus',
        conceptOverview: 'Integration is the continuous accumulation of infinitesimal quantities. A Riemann sum approximates the area under f(x) by tiling it with n rectangles. As n approaches infinity and the width of each strip dx approaches zero, the step approximation converges to the exact definite integral.',
        keyVisualTakeaway: 'Integral = limit of sum of f(x_i) * dx as dx -> 0. The gaps and overhangs shrink to zero.',
        mathConfig: {
          type: 'integral',
          formula: 'f(x) = sin(x) + 1.2'
        },
        quiz: [
          {
            id: 'mq-4',
            topicId: 'math-riemann-integral',
            subjectId: 'math',
            question: 'What is the geometric meaning of the definite integral of f(x) from a to b?',
            options: [
              'The average slope of f(x) over [a, b]',
              'The net signed area trapped between the curve f(x) and the x-axis',
              'The length of the curve f(x)',
              'The second derivative of f(x)'
            ],
            correctIndex: 1,
            explanation: 'The definite integral represents the net signed area bounded by the curve, the x-axis, and vertical lines x=a and x=b.',
            visualDetail: 'Area above the x-axis counts as positive area; area below counts as negative.'
          }
        ]
      },
      {
        id: 'math-fourier',
        subjectId: 'math',
        title: 'Fourier Series: Harmonic Wave Synthesis',
        tagline: 'Add odd harmonic sine waves one by one to construct a sharp square wave from pure smooth ripples.',
        difficulty: 'Advanced',
        visualType: 'fourier',
        conceptOverview: 'Jean-Baptiste Fourier discovered that ANY periodic waveform can be decomposed into an infinite sum of simple sine and cosine harmonics. By adding higher frequency waves with decaying amplitudes (1/1*sin(t) + 1/3*sin(3t) + 1/5*sin(5t)...), we synthesize sharp square waves from pure circles!',
        keyVisualTakeaway: 'Sharp square transitions require high-frequency harmonics. Notice the slight ripple at corners known as the Gibbs phenomenon.',
        mathConfig: {
          type: 'fourier',
          formula: 'Square Wave = (4/pi) * sum( (1/n) * sin(n * omega * t) ) for odd n'
        },
        quiz: [
          {
            id: 'mq-5',
            topicId: 'math-fourier',
            subjectId: 'math',
            question: 'Why does adding higher frequency sine harmonics create a square wave?',
            options: [
              'Higher harmonics cancel out the curvature on plateaus while steepening the vertical transition edges',
              'Higher harmonics reduce the total energy of the wave to zero',
              'Because sine waves are naturally square in digital circuits',
              'It turns the signal into direct current (DC)'
            ],
            correctIndex: 0,
            explanation: 'Each odd harmonic introduces ripples whose peaks and troughs mathematically flatten the top plateau while sharpening the rise and fall slopes.',
            visualDetail: 'The circular rotating epicycles add up constructively along the step edges.'
          }
        ]
      }
    ]
  }
];
