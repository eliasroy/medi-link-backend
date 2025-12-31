resource "aws_ecs_cluster" "medilink_cluster" {
  name = "medilink-cluster"
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name              = "/ecs/medilink"
  retention_in_days = 30
}

resource "aws_lb" "alb" {
  name               = "medilink-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "tg" {
  name        = "medilink-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
}

# El listener HTTP ha sido movido a alb-listeners.tf para redirigir a HTTPS
resource "aws_ecs_task_definition" "task" {
  family                   = "medilink-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name  = "medilink"
      image = "${var.account_id}.dkr.ecr.us-east-1.amazonaws.com/medilink-backend:latest"
      essential = true
      portMappings = [{
        containerPort = 3000
        protocol = "tcp"
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    environment = [
        { name = "PORT", value = "3000" },
        { name = "DB_PORT", value = "" },
        { name = "DB_HOST", value = "" },
        { name = "DB_USER", value = "" },
        { name = "DB_NAME", value = "" },
        { name = "DB_PASSWORD", value = "" },
        { name = "JWT_SECRET", value = "" }
      ]
    
    }
  ])
}
resource "aws_ecs_service" "service" {
  name            = "medilink-service"
  cluster         = aws_ecs_cluster.medilink_cluster.id
  task_definition = aws_ecs_task_definition.task.arn
  launch_type     = "FARGATE"
  health_check_grace_period_seconds = 120

  network_configuration {
    subnets          = module.vpc.public_subnets
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.tg.arn
    container_name   = "medilink"
    container_port   = 3000
  }

  desired_count = 2
}
