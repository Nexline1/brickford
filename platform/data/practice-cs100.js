// Brickford — practice items, CS 100 (Python for ML), CS50P lectures 3 to 5 (T-070).
// The Python bridge starts 22 Nov; checkpoint 1 (6 Dec) asks for these three.
//
// SOURCES, AND WHAT THEY DO NOT COVER. Each item is written from the lecture
// notes in loop/specs/T-070-python-practice/sources/<videoId>.examples.md,
// taken from transcripts fetched 13 Nov 2026. Only the first ~60% of each
// lecture was read, so items use only what those notes contain:
//   cs100.0.3 Exceptions  (LW7g1169v7w)  0:05-29:01 of 44:30. Not covered: pass,
//     raising exceptions, the get_int function.
//   cs100.0.4 Libraries   (MztLZWibctI)  0:05-28:17 of 1:17:23. Not covered: slice,
//     pip/cowsay, APIs/requests/json, making your own libraries.
//   cs100.0.5 Unit Tests  (tIrcxwLqzjQ)  0:24-27:54 of 50:49. Not covered: several
//     test functions, pytest.raises, testing str, folders of tests.
//   cs100.1.0 NumPy for beginners (QUT1VHiLmmI, T-071), from
//     loop/specs/T-071-numpy-practice/sources/: 0:00-37:51 of 58:08 (the
//     transcript is cut mid-sentence). Covered: why not lists, creating arrays,
//     ndim/shape/dtype/itemsize/nbytes, slicing and assignment, the initialisers,
//     the ones-with-a-zero-ring exercise, aliasing against copy(), element-wise
//     arithmetic. Not covered: the rest of the maths, statistics, stacking,
//     loading from a file, boolean masking and the advanced-indexing challenge.
//     numpy is not a Brickford dependency and may be missing where the gate runs,
//     so verify-content also runs a plain-Python-list restatement of each NumPy
//     `output` program; the printed values are chosen to need no NumPy formatting
//     (a tuple and scalars, never a whole array).
//
// Shapes as in practice-math110.js; rules in docs/CONTENT-STANDARD.md. An
// `output` item's `code` is the reference solution (shown only after an
// attempt): tools/verify-content.js runs it with python3 -I and compares what
// it prints with `out`, and recomputes `out` in expectedPractice. The programs
// read no input and use no randomness in what they print, so the run is the
// same in the gate and in Replit. Similar to the lecture, never identical.
window.DAR = window.DAR || {};
DAR.PRACTICE = DAR.PRACTICE || {};
Object.assign(DAR.PRACTICE, {
  // ---- Lecture 3: Exceptions ----
  "cs100.0.3": [
    { id: "p1", type: "output", q: "Write a program that goes through the strings \"12\", \"dog\", \"-3\", \"4.5\" and \"0\" with a for loop. Convert each with int() inside a try. On a ValueError add 1 to a counter called bad; in an else, add the number to a total. At the end, print(total, bad). What does it print?",
      code: "total = 0\nbad = 0\nfor s in [\"12\", \"dog\", \"-3\", \"4.5\", \"0\"]:\n    try:\n        n = int(s)\n    except ValueError:\n        bad += 1\n    else:\n        total += n\nprint(total, bad)\n",
      out: "9 2",
      expl: "int() accepts \"12\", \"-3\" and \"0\" (12 - 3 + 0 = 9) and raises ValueError on \"dog\" and also on \"4.5\": a string with a decimal point is not an integer literal. The else runs only when the try succeeded, so a bad string never reaches the total." },
    { id: "p2", type: "worked", q: "A program reads try: age = int(input(\"Age? \")) / except ValueError: print(\"Not a number\"), and then, outside the try, print(f\"You are {age}\"). The user types ten. What appears on the screen, and why? Give one fix.",
      result: "First Not a number, then a NameError: name 'age' is not defined, on the last line.",
      steps: ["int(\"ten\") raises ValueError. It is raised on the right of the =, before anything is assigned, so age never gets a value.",
              "The except catches it and prints Not a number. The program then carries on to the line after the try.",
              "print(f\"You are {age}\") uses a name that was never assigned: NameError. It is the order of operations, not a scope problem.",
              "Fix: move the print into an else under the try, which runs only if the conversion worked; or loop with while True and break once it works, and print after the loop."] },
    { id: "p3", type: "write", q: "A classmate wraps a whole 20-line program in try: ... and ends it with a bare except: print(\"Something went wrong\"). What is wrong with that, and how would you rewrite it?",
      points: ["A bare except catches every error, not just the one you expected.",
               "It hides other bugs: a typo that raises NameError prints the same friendly message, so you do not know what went wrong.",
               "Name the specific exception you expect, e.g. except ValueError (spelled and capitalised exactly).",
               "Put only the line or lines that can actually raise inside the try, not the whole program.",
               "Code that should run only when the try succeeded goes in an else (or after a break out of a re-prompt loop)."],
      model: "A bare except catches everything, so it does not just handle the problem you had in mind, such as a user typing cat where a number was expected. It also swallows real bugs: a misspelled variable raises NameError, and the program calmly prints Something went wrong, so you never find out what actually failed. It is the lazy version. Instead, put in the try only the line that can fail, typically x = int(input(...)), catch the exception you expect by its exact name, except ValueError, and put the rest of the work in an else that runs only when the conversion succeeded, or in a while True loop that breaks once the input is good. Any other error then still stops the program with a traceback that tells you where to look." },
  ],
  // ---- Lecture 4: Libraries ----
  "cs100.0.4": [
    { id: "p1", type: "output", q: "Write a program that imports random, makes the list deck = [\"ace\", \"two\", \"three\"], and then runs print(random.shuffle(deck), len(deck)). What does it print?",
      code: "import random\n\ndeck = [\"ace\", \"two\", \"three\"]\nprint(random.shuffle(deck), len(deck))\n",
      out: "None 3",
      expl: "random.shuffle shuffles the list in place and returns nothing, so the value printed for it is None. The list itself still has its three cards, now in some order; print(deck) on the next line would show them, in list syntax." },
    { id: "p2", type: "output", q: "Save a file count.py that imports sys and runs print(\"arguments:\", len(sys.argv) - 1). Run it as python count.py, with nothing typed after the file name. What does it print?",
      code: "import sys\n\nprint(\"arguments:\", len(sys.argv) - 1)\n",
      out: "arguments: 0",
      expl: "sys.argv is a list, and sys.argv[0] is always the program's own name, so with nothing after the file name the list has one element and 1 - 1 = 0. That is also why sys.argv[1] raises IndexError here: there is no second element." },
    { id: "p3", type: "write", q: "One program starts with import random and calls random.choice(...); another starts with from random import choice and calls choice(...). What is the trade-off between the two forms?",
      points: ["Both load the same function from the random module; the program behaves the same.",
               "from random import choice puts the name choice directly in your file, so calls are shorter.",
               "That name can collide with one of your own: a variable or function you call choice.",
               "import random keeps the function inside the module's name, random.choice, so it is clear where it comes from and it cannot clash.",
               "There is no single right answer: brevity against the risk of a name collision."],
      model: "Both forms load random's choice function, and the program works the same either way. from random import choice copies the name choice straight into your program, so you can write choice([\"heads\", \"tails\"]) without the prefix, which is shorter. The cost is that the name now lives alongside your own names, so if you also define a variable or function called choice, one silently replaces the other. import random keeps everything inside the module's namespace: you write random.choice each time, which is longer, but it says exactly where the function comes from and it cannot collide with anything of yours. Neither is always right; it is a trade between brevity and collisions." },
  ],
  // ---- Lecture 5: Unit Tests ----
  "cs100.0.5": [
    { id: "p1", type: "output", q: "square(n) has a bug: its body is return n * 2. Write a program that defines it that way, then loops over 1, 2, 0, -2 and 5 and adds 1 to a counter passed every time square(n) == n * n still holds. Print passed. What does it print?",
      code: "def square(n):\n    return n * 2\n\n\npassed = 0\nfor n in [1, 2, 0, -2, 5]:\n    if square(n) == n * n:\n        passed += 1\nprint(passed)\n",
      out: "2",
      expl: "n * 2 equals n * n only at 0 and 2, so a test that tried just those would pass and the bug would ship. 1 gives 2 instead of 1, -2 gives -4 instead of 4, 5 gives 10 instead of 25: test negatives and other values too, not only the obvious ones." },
    { id: "p2", type: "worked", q: "square(n) is written by mistake as return n + n. For how many integers n does assert square(n) == n * n still pass? Which values should a test of square include, and why?",
      num: 2,
      result: "Exactly 2: n = 0 and n = 2. A test needs at least one value other than those, e.g. 3 and a negative such as -3.",
      steps: ["The assert passes when n + n = n * n, that is 2n = n², so n² - 2n = 0, n(n - 2) = 0.",
              "That holds for n = 0 and n = 2 and for no other integer: 2 integers.",
              "So testing only 2 and 0 is getting lucky: both pass with the bug. 3 gives 6, not 9 (pytest shows assert 6 == 9).",
              "Include a positive other than 2, a negative (-3 gives -6, not 9), and 0 as the corner case: several inputs, not one or two obvious ones."] },
    { id: "p3", type: "write", q: "A friend's calculator.py does everything inside main(): it reads x with input(), squares it and prints the result, and the last line of the file is a plain main(). Why is this hard to unit-test, and what two changes make it testable?",
      points: ["Importing the file from a test runs the plain main() call, so the test would stop and wait for input.",
               "Guard the call: if __name__ == \"__main__\": main(), so it runs when you run the file but not when a test imports it.",
               "The squaring is buried inside main with input() and print(), so there is no function a test can call with a value and check the result of.",
               "Move the logic into its own function, e.g. def square(n): return n * n, with a defined input and a returned output.",
               "Then test_calculator.py can do from calculator import square and assert square(3) == 9 and so on; pytest runs it.",
               "What stays in main (the input() and the print) is still untested, so keep it as thin as possible."],
      model: "Two things stop a test from using this file. First, the last line calls main() unconditionally, so the moment test_calculator.py imports calculator, main runs and sits waiting for input. Guarding it with if __name__ == \"__main__\": main() means it runs when you execute calculator.py yourself but not when another file imports it. Second, the actual work, squaring, happens inside main between an input() and a print(), so there is nothing a test can call with a number and check. Pull it out into a function like def square(n): return n * n, which takes an argument and returns a value. Then test_calculator.py can import square and assert square(2) == 4, square(3) == 9, square(-3) == 9 and square(0) == 0, and pytest runs those for you. Only the thin main, the user input and printing, is left untested." },
  ],
  // ---- Unit II: NumPy for beginners (Keith Galli) ----
  "cs100.1.0": [
    { id: "p1", type: "output", q: "Make g = np.ones((4, 6), dtype='int16'). With ONE slice assignment that uses negative ends, set everything except the outer ring to 0; then set the element in row 2, column 3 to 5. Finally run print(g.shape, g.nbytes, g[2, 3], g[1, 1], g[0, 3]). What does it print?",
      code: "import numpy as np\n\ng = np.ones((4, 6), dtype='int16')\ng[1:-1, 1:-1] = 0\ng[2, 3] = 5\nprint(g.shape, g.nbytes, g[2, 3], g[1, 1], g[0, 3])\n",
      out: "(4, 6) 48 5 0 1",
      expl: "shape is (rows, columns), so (4, 6). nbytes is size times itemsize: 24 elements of 2 bytes each (int16), 48. The slice 1:-1 stops before the last index, so rows 1-2 and columns 1-4 become 0 and the ring stays 1: g[0, 3] is on the top edge (1), g[1, 1] is just inside it (0). g[2, 3] was written after the zeros, so it is 5. Indices count from 0." },
    { id: "p2", type: "worked", q: "a = np.array([1, 2, 3]), then b = a and c = a.copy(). Next b[0] = 7, then a += 1, then c[2] = 0. What do print(a), print(b) and print(c) show, and why?",
      result: "a is [8 3 4], b is [8 3 4], c is [1 2 0].",
      steps: ["b = a does not copy anything: it gives the same array a second name. c = a.copy() makes a separate array holding 1 2 3 at that moment.",
              "b[0] = 7 changes the one array that a and b both name: it is now 7 2 3. c is untouched, still 1 2 3.",
              "a += 1 adds 1 to every element of that same shared array, element by element: 8 3 4. b shows it too, because b is that array.",
              "c[2] = 0 changes only the copy: 1 2 0. So a and b print [8 3 4] and c prints [1 2 0]. If you want to change b without touching a, take b = a.copy()."] },
    { id: "p3", type: "write", q: "A friend asks why anyone bothers with NumPy when Python already has lists. Using what the lecture says, give the reasons.",
      points: ["Fixed types: a NumPy int is a fixed number of bytes (int32 is 4, int16 is 2, int8 is 1), while a Python int carries its value plus its type, a reference count and a size, so it is much bigger.",
               "Less work per element: the array has one type, so NumPy does not check the type of every element as it goes.",
               "Contiguous memory: the values sit next to each other, where a list holds pointers to objects scattered around memory.",
               "That layout lets the processor use SIMD (one instruction on several values at once) and use its cache better, which is where the speed comes from.",
               "Element-wise maths: a * b multiplies item by item, which a list does not do, on top of everything a list can do (insert, delete, append, concatenate).",
               "It is the base the rest stands on: Pandas, SciPy, plotting, images and ML tensors are all arrays."],
      model: "The short answer is speed, and the lecture gives three reasons for it. First, NumPy stores numbers with a fixed type: an int32 is 4 bytes, and you can choose int16 or int8 to use 2 or 1, while a Python int is a full object carrying its value, its type, a reference count and a size, so it takes far more room. Second, because every element has the same type, NumPy does not have to check each element's type as it works. Third, an array's values sit next to each other in memory, where a list is a set of pointers to objects scattered all over; contiguous values let the CPU apply one instruction to several numbers at once (SIMD) and make better use of its cache. On top of that, NumPy does element-wise maths, so a * b multiplies two arrays item by item, which lists cannot do. And it is the base of scientific Python: Pandas is built on it, and images and ML tensors are arrays." },
  ],
});
