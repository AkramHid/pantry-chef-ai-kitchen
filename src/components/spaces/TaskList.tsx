
import React from 'react';
import { Calendar, User, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SpaceTask } from '@/types/space';
import { ViewMode } from '@/components/ui/list-layout';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: SpaceTask[];
  viewMode: ViewMode;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  viewMode,
  onToggleTask,
  onDeleteTask,
}) => {
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const TaskCard = ({ task }: { task: SpaceTask }) => (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.completed && "opacity-60 bg-muted/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 mt-0.5"
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-kitchen-green" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-sm",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.name}
              </h3>
              
              {task.notes && (
                <p className="text-xs text-muted-foreground mt-1">
                  {task.notes}
                </p>
              )}
              
              <div className="flex items-center gap-3 mt-2">
                {task.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(task.dueDate, 'MMM dd')}</span>
                  </div>
                )}
                
                {task.assignee && (
                  <Badge variant="secondary" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    {task.assignee}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDeleteTask(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        {pendingTasks.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              Pending Tasks ({pendingTasks.length})
            </h3>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
        
        {completedTasks.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">
              Completed Tasks ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Pending Tasks ({pendingTasks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-3">
            Completed Tasks ({completedTasks.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
