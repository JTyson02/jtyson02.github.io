#ifdef __APPLE__
#include <GLUT/glut.h> // include glut for Mac
#else
#include <GL/freeglut.h> //include glut for Windows
#endif


// the window's width and height
int width, height;

// the three vertices of a triangle
float v0[2];
float v1[2];
float v2[2];


void createTriangle()
{
    // initialize the triangle's vertices
    v0[0] = 0.0f;
    v0[1] = 0.0f;
    v1[0] = 5.0f;
    v1[1] = 0.0f;
    v2[0] = 2.5f;
    v2[1] = 3.0f;
}

void init(void)
{
    // initialize the size of the window
    width = 600;
    height = 600;
    createTriangle();
}

// called when the GL context need to be rendered
void display(void)
{
    // clear the screen to white, which is the background color
    glClearColor(1.0, 1.0, 1.0, 0.0);

    // clear the buffer stored for drawing
    glClear(GL_COLOR_BUFFER_BIT);

    int size = 25;              // determing the grid size and the numbers of cells
    if (size % 2 != 0) ++size;     // better to be an odd size

    glMatrixMode(GL_MODELVIEW);
    glBegin(GL_LINES);
    for (int i = 0; i < size + 1; i++) {
        if ((float)i == size / 2.0f) {
            glColor3f(0.0f, 0.0f, 0.0f);
        }
        else {
            glColor3f(0.8f, 0.8f, 0.8f);
        }
        glVertex3f(-size / 2.0f, 0.0f, -size / 2.0f + i);
        glVertex3f(size / 2.0f, 0.0f, -size / 2.0f + i);
        glVertex3f(-size / 2.0f + i, 0.0f, -size / 2.0f);
        glVertex3f(-size / 2.0f + i, 0.0f, size / 2.0f);
    }
    glEnd();

    glutSwapBuffers();
}

// called when window is first created or when window is resized
void reshape(int w, int h)
{
    // update thescreen dimensions
    width = w;
    height = h;

    //do an orthographic parallel projection, limited by screen/window size
   
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();
    gluLookAt(20, 20, -20, 0, 0, 0, 0, 1, 0);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluPerspective(45, 2.0, 0.1, 1000);
    glViewport(0, 0, w, h);

    glutPostRedisplay();
}

int main(int argc, char* argv[])
{
    // before create a glut window,
    // initialize stuff not opengl/glut dependent
    init();

    //initialize GLUT, let it extract command-line GLUT options that you may provide
    //NOTE that the '&' before argc
    glutInit(&argc, argv);

    // specify as double bufferred can make the display faster
    // Color is speicfied to RGBA, four color channels with Red, Green, Blue and Alpha(depth)
    glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA);

    //set the initial window size */
    glutInitWindowSize((int)width, (int)height);

    // create the window with a title
    glutCreateWindow("Camera Demo");

    /* --- register callbacks with GLUT --- */

    //register function to handle window resizes
    glutReshapeFunc(reshape);

    //register function that draws in the window
    glutDisplayFunc(display);

    //start the glut main loop
    glutMainLoop();

    return 0;
}
