#ifdef __APPLE__
#include <GLUT/glut.h> // include glut for Mac
#else
#include <GL/freeglut.h> //include glut for Windows
#endif

#include <math.h>
#include <glm/glm.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <vector>


using namespace glm;
using namespace std;

// the window's width and height
int width, height;

class Bullet {
public:
    Bullet(vec2 launcherPos, vec2 launcherDir) {

        this->launchDir = launcherDir;

        this->position = launcherPos;

        lived = 0;

    }
    
    float lived;

    vec2 launchDir;

    vec3 color = vec3(1, 0, 0);

    vec2 position;

    const float speed = 3;

    float radius = .1;

};

vector<Bullet*> bullets;

double dPi = 3.14159265358979323846;

vec2 shooterCircleCenter = vec2(0,-3);

float fAngle = 0;

int targetHits = 0;

vec2 targetCircleCenter;

float targetCircleRadius = .2f;

vec3 targetCircleColor = vec3(0.2,0,0);



float deltaTime = 0;
int currentTime = 0;
int lastTime = 0;

bool IsCirclesOverlapping(vec2 center1, float radius1, vec2 center2, float radius2) {
    float c1_c2 = glm::sqrt(pow(center1.x - center2.x, 2) + pow(center1.y - center2.y, 2));

    return c1_c2 < radius1 + radius2;
}

void DrawCircle(vec2 center, float radius, int verticesNum, vec3 color) {
    glBegin(GL_LINE_LOOP);
    glColor3fv(value_ptr(color));
    for (int i = 0; i < verticesNum; i++) {
        float t = (i / (float)verticesNum) * 2.0f * 3.14f;
        glVertex2fv(value_ptr(vec2(center.x + radius * cos(t), center.y + radius * sin(t))));
    }
    glEnd();
}

void DrawFilledCircle(vec2 center, float radius, int verticesNum, vec3 color) {
    glBegin(GL_POLYGON);
    glColor3fv(value_ptr(color));
    for (int i = 0; i < verticesNum; i++) {
        float t = (i / (float)verticesNum) * 2.0f * 3.14f;
        glVertex2fv(value_ptr(vec2(center.x + radius * cos(t), center.y + radius * sin(t))));
    }
    glEnd();
}

void NewTarget() {

    targetHits = 0;

    targetCircleRadius = .2f;

    targetCircleColor = vec3(0.2, 0, 0);

    targetCircleCenter = vec2(static_cast<float>(-3.5f + (rand() % 7)), static_cast<float>(rand() % 4));

}

void CheckBulletTime() {

    for (int i = 0; i < bullets.size(); i++)
    {

        bullets[i]->lived += 0.001f;

    }

    for (int i = 0; i < bullets.size(); i++)
    {
        if (bullets[i]->lived >= 3) {

            cout << "deleting bullet" << endl;

            Bullet* tempBullet = bullets[i];

            bullets.erase(bullets.begin() + i);

            delete tempBullet;

            tempBullet = nullptr;

        }
    }



}

void BulletMove(Bullet* current) {

    vec2 direction = normalize(current->launchDir);

    current->position += current->speed * direction * (deltaTime / 500);

}

bool CollisionManager(Bullet* current, int i) {

    if (IsCirclesOverlapping(current->position, current->radius, targetCircleCenter, targetCircleRadius)) {

        targetHits++;

        targetCircleRadius += .01f;

        targetCircleColor += vec3(0.01f, 0, 0);

        Bullet* tempBullet = current;

        bullets.erase(bullets.begin() + i);

        delete tempBullet;

        tempBullet = nullptr;

        return true;

    }

    return false;

}

void DrawLine(vec2 x, vec2 y) {
    glBegin(GL_LINES);
    glColor3f(0, 0, 1);
    glVertex2fv(value_ptr(x));
    glVertex2fv(value_ptr(y));
    glEnd();
}

void DrawLine(vec2 x, vec2 y, vec3 color) {
    glBegin(GL_LINES);
    glColor3fv(value_ptr(color));
    glVertex2fv(value_ptr(x));
    glVertex2fv(value_ptr(y));
    glEnd();
}


void init(void)
{
    // initialize the size of the window
    width = 600;
    height = 600;

    srand((unsigned)time(NULL));

    targetCircleCenter = vec2(static_cast<float>(-3.5f + (rand() % 7)), static_cast<float>(rand() % 4));

}

// called when the GL context need to be rendered
void display(void)
{
    // clear the screen to white, which is the background color
    glClearColor(1.0, 1.0, 1.0, 0.0);

    // clear the buffer stored for drawing
    glClear(GL_COLOR_BUFFER_BIT);


    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    //Draw floor bar
    DrawLine(vec2(-2,-3), vec2(2,-3));

    //Draw cannon body
    DrawCircle(shooterCircleCenter, 0.4f, 30, vec3(.5,.5,0));
    
    glPushMatrix();

    glTranslatef(shooterCircleCenter.x,shooterCircleCenter.y,0);

    glRotatef(fAngle, 0, 0, 1);

    DrawLine(vec2(0,0), vec2(0,1), vec3(.5,.5,0));

    glPopMatrix();
    glPopMatrix();

    for (int i = 0; i < bullets.size(); i++) {

        DrawCircle(bullets[i]->position, bullets[i]->radius, 30, bullets[i]->color);

    }

    DrawFilledCircle(targetCircleCenter, targetCircleRadius, 30, targetCircleColor);

    CheckBulletTime();

    if (targetHits >= 30) {
        NewTarget();
    }

    glutSwapBuffers();
}



// called when window is first created or when window is resized
void reshape(int w, int h)
{
    // update thescreen dimensions
    width = w;
    height = h;

    //do an orthographic parallel projection, limited by screen/window size
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(-5.0, 5.0, -5.0, 5.0);

    /* tell OpenGL to use the whole window for drawing */
    glViewport(0, 0, (GLsizei)width, (GLsizei)height);

    //printf("Reshape function is called.\n");

    glutPostRedisplay();
}


//Updating the time
void idle() {
    deltaTime = glutGet(GLUT_ELAPSED_TIME) - lastTime;
    
    for (int i = 0; i < bullets.size(); i++) {
        BulletMove(bullets[i]);
        
        if (CollisionManager(bullets[i], i))
            i--;
    }

    lastTime = glutGet(GLUT_ELAPSED_TIME);
    glutPostRedisplay();
}


void keyboard(unsigned char key, int x, int y)
{
    if (key == 27) // 'esc' key
        exit(0);

    //move left (A)
    if (key == 97 || key == 65) {

        float velocity = 0.05 * deltaTime;

        shooterCircleCenter.x -= abs(velocity);
        
        if (shooterCircleCenter.x <= -2)
            shooterCircleCenter.x = -2;
    }

    //move right (B)
    if (key == 100 || key == 68) {

        float velocity = 0.05 * deltaTime;

        shooterCircleCenter.x += abs(velocity);

        if (shooterCircleCenter.x >= 2)
            shooterCircleCenter.x = 2;

    }

    //rotate left (K)
    if (key == 107 || key == 75) {

        fAngle += 90 * deltaTime / 1000 ;

    }

    //rotate right (L)
    if (key == 108 || key == 76) {

        fAngle -=  90 * deltaTime / 1000;

    }

    //Shoot (Space)
    if (key == 32)
    {
        vec2 direction;
        direction.x = cos((fAngle + 90) * dPi / 180.0f);
        direction.y = sin((fAngle + 90) * dPi / 180.0f);

        bullets.push_back(new Bullet(vec2(shooterCircleCenter.x + direction.x, shooterCircleCenter.y + direction.y), direction));

    }

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
    glutCreateWindow("Cannon demonstration");

    /* --- register callbacks with GLUT --- */

    //register function to handle window resizes
    glutReshapeFunc(reshape);

    //register function that draws in the window
    glutDisplayFunc(display);

    glutKeyboardFunc(keyboard);

    //register function that is called when no other events is in queue
    glutIdleFunc(idle);

    //start the glut main loop
    glutMainLoop();

    return 0;
}