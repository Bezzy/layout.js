let left_nav = document.getElementById("left_nav");

let is_down = false;
let down_target = null;
let previous_mouse_x = 0;
let current_mouse_x = 0;

let grid_folder = document.getElementsByClassName("grid-folder");
grid_folder = grid_folder[0];
let grid_folder_width = grid_folder.getBoundingClientRect().width;
let grid_element = document.getElementsByClassName("grid-element");
let grid_element_rect = grid_element[0].getBoundingClientRect();
let grid_element_width = grid_element_rect.width;
let grid_element_height = grid_element_rect.height;
let grid_element_x = grid_element.x;
let grid_element_y = grid_element.y;
let greatest_x_line = 0;
console.log(grid_element);

let longest_line = 0;

let total_width = 0;
let x = 0, y = 0;
for (let i = 0; i < grid_element.length; i++) {
    total_width += grid_element_width; // Need to add padding between el
    if (grid_folder_width < total_width) {
        y++; x = 0;
        if (total_width > longest_line) {longest_line = total_width - grid_element_width;}
        total_width = grid_element_width;
    }

    let position_x = (x * grid_element_width) + (x !== grid_element.width ? (x * 16) : 0);
    let position_y = y * grid_element_height + (y *16);
    grid_element[i].position_x = position_x;
    grid_element[i].position_y = position_y;
    grid_element[i].style.transform = `translate3d(${position_x}px, ${position_y}px, 0)`;
    console.log(x);
    ++x;
}

document.addEventListener("mousedown", function(e) {
    is_down = true;
    down_target = e.target;
    current_mouse_x = e.screenX;
});

document.addEventListener("mouseup", function(e) {
    is_down = false;
    down_target = null;
});


/*
* left_nav : Element
* movement_x : number
*/
function left_nav_mouse_resizing(left_nav, mouse_x) {
    left_nav.style.width = `${mouse_x <= 56 ? 56 : mouse_x}px`;
}


document.addEventListener("mousemove", function(e) {
    // console.log(e.screenX);
    if (is_down && (down_target === left_nav)) {
        left_nav_mouse_resizing(left_nav, e.screenX);
    }
});


function animate_grid() {
    for (let i = 0; i < grid_element.length; i++) {


        let x_per_second = (grid_element[i].diff_x / 16) / 1;
        let y_per_second = (grid_element[i].diff_y / 16) / 1;
        

        grid_element[i].diff_x -=  x_per_second;
        grid_element[i].diff_y -=  y_per_second;



        // NOTE(): Because x and y are the same I just check x.
        if (grid_element[i].diff_x > 0 || grid_element[i].diff_y > 0) {
            console.log("Heyyy");
            grid_element[i].style.transform = `translate3d(${grid_element[i].old_position_x > grid_element[i].position_x ? grid_element[i].old_position_x -= x_per_second : grid_element[i].old_position_x += x_per_second}px, ${grid_element[i].old_position_y > grid_element[i].position_y ? grid_element[i].old_position_y -= y_per_second : grid_element[i].old_position_y += y_per_second}px, 0)`;
        }
        
    }

    let done_animate = true;
    for (let i = 0; i < grid_element.length; i++) {
        if (grid_element[i].diff_x > 0) {
            done_animate = false;
        }
    }

    if (!done_animate) {
        requestAnimationFrame(function() {animate_grid();})
    }
}

// TODO(): Fix condition is alwys true because we don't assign correct
//         longest_line

let position_x = 0;
let position_y = 0;

let stalk_me = new ResizeObserver(entries => {
    for (let entry of entries) {
        grid_folder_width = grid_folder.getBoundingClientRect().width;
        if ((grid_folder_width < longest_line) || ((longest_line + grid_element_width) < grid_folder_width)) {
            longest_line = 0;
            console.log("Im in");
            total_width = 0;
            let x = 0, y = 0;
            for (let i = 0; i < grid_element.length; i++) {
                grid_element[i].old_position_x = grid_element[i].position_x;
                grid_element[i].old_position_y = grid_element[i].position_y;

                total_width += grid_element_width; // Need to add padding between el
                if (grid_folder_width < total_width) {
                    y++;
                    x = 0;
                    if (total_width > longest_line) {longest_line = total_width - grid_element_width;}
                    total_width = grid_element_width;
                }

                let position_x = (x * grid_element_width) + (x !== grid_element.width ? (x * 16) : 0);
                let position_y = y * grid_element_height + (y * 16);
                grid_element[i].position_x = position_x;
                grid_element[i].position_y = position_y;
                // grid_element[i].style.transform = `translate3d(${position_x}px, ${position_y}px, 0)`;
                
                grid_element[i].diff_x = Math.abs(grid_element[i].old_position_x - grid_element[i].position_x);
                grid_element[i].diff_y = Math.abs(grid_element[i].old_position_y - grid_element[i].position_y);
                ++x;
            }

            requestAnimationFrame(function () {
                animate_grid();
            });
        }
    }
});

stalk_me.observe(grid_folder);